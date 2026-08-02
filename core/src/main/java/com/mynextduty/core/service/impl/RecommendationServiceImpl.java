package com.mynextduty.core.service.impl;

import com.mynextduty.core.dto.DutyRecommendationDto;
import com.mynextduty.core.entity.Duties;
import com.mynextduty.core.entity.Interest;
import com.mynextduty.core.entity.User;
import com.mynextduty.core.entity.UserDutyProgress;
import com.mynextduty.core.entity.UserInterest;
import com.mynextduty.core.enums.Priority;
import com.mynextduty.core.enums.ProgressStatus;
import com.mynextduty.core.exception.UserNotFoundException;
import com.mynextduty.core.repository.DutiesRepository;
import com.mynextduty.core.repository.UserDutyProgressRepository;
import com.mynextduty.core.repository.UserRepository;
import com.mynextduty.core.service.CurrentUserService;
import com.mynextduty.core.service.RecommendationService;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationServiceImpl implements RecommendationService {

    private static final int MAX_RESULTS = 20;

    private final UserRepository userRepository;
    private final DutiesRepository dutiesRepository;
    private final UserDutyProgressRepository userDutyProgressRepository;
    private final CurrentUserService currentUserService;

    @Override
    public List<DutyRecommendationDto> getPersonalizedRecommendations() {
        User user = loadUser();
        return mapAndRank(dutiesRepository.findByTargetLifeStageAndIsActiveTrue(user.getLifeStage()), user);
    }

    @Override
    public List<DutyRecommendationDto> getRecommendationsByLifeStage() {
        User user = loadUser();
        return mapAndRank(dutiesRepository.findByTargetLifeStageAndIsActiveTrue(user.getLifeStage()), user);
    }

    @Override
    public List<DutyRecommendationDto> getRecommendationsByInterests() {
        User user = loadUser();
        return mapAndRank(dutiesRepository.findByUserInterests(user.getId()), user);
    }

    @Override
    public List<DutyRecommendationDto> getCriticalRecommendations() {
        return mapAndRank(dutiesRepository.findByPriorityAndIsActiveTrue(Priority.CRITICAL), loadUser());
    }

    // ------------------------------------------------------------------ helpers

    private User loadUser() {
        return userRepository.findById(currentUserService.getCurrentUserId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    /**
     * Loads the user's progress records, maps each duty to a DTO with matchScore,
     * sorts by Priority ordinal then matchScore descending, and limits to 20 results.
     */
    private List<DutyRecommendationDto> mapAndRank(List<Duties> duties, User user) {
        // Build a map of dutyId → progress for O(1) lookup
        Map<Long, UserDutyProgress> progressMap = userDutyProgressRepository
                .findByUserId(user.getId())
                .stream()
                .collect(Collectors.toMap(
                        p -> p.getDuties().getId(),
                        p -> p,
                        (existing, replacement) -> existing   // keep first on conflict
                ));
        return duties.stream()
                .map(duty -> toDto(duty, user, progressMap, resolveUserInterestIds(user)))
                .sorted(
                        Comparator
                                .comparingInt((DutyRecommendationDto d) -> d.getPriority().ordinal())
                                .thenComparingInt(d -> -d.getMatchScore())   // descending matchScore
                )
                .limit(MAX_RESULTS)
                .collect(Collectors.toList());
    }

    /** Extracts the set of Interest IDs from the user's UserInterest join records. */
    private Set<Long> resolveUserInterestIds(User user) {
        List<UserInterest> userInterests = user.getUserInterests();
        if (userInterests == null || userInterests.isEmpty()) {
            return Set.of();
        }
        return userInterests.stream()
                .map(ui -> ui.getInterest().getId())
                .collect(Collectors.toSet());
    }

    /** Maps a single Duties entity → DutyRecommendationDto, computing all fields inline. */
    private DutyRecommendationDto toDto(
            Duties duty,
            User user,
            Map<Long, UserDutyProgress> progressMap,
            Set<Long> userInterestIds) {
        UserDutyProgress progress = progressMap.get(duty.getId());
        return DutyRecommendationDto.builder()
                .id(duty.getId())
                .title(duty.getTitle())
                .description(duty.getDescription())
                .category(duty.getCategory() != null ? duty.getCategory().getName() : null)
                .priority(duty.getPriority())
                .estimatedCost(duty.getEstimatedCost())
                .timeToComplete(duty.getTimeToComplete())
                .reasonForRecommendation(null)    // not computed in this implementation
                .matchScore(computeMatchScore(duty, user, userInterestIds))
                .isCompleted(progress != null && progress.getStatus() == ProgressStatus.COMPLETED)
                .isInProgress(progress != null && progress.getStatus() == ProgressStatus.IN_PROGRESS)
                .build();
    }

    /**
     * Computes a match score in [0, 100]:
     *   Base 100
     *   − 40 if duty.targetLifeStage != user.lifeStage
     *   − 30 if no overlap between duty.relatedInterests and user's interests
     *   − 20 if user.age is outside [duty.minAge, duty.maxAge]
     *   − 10 if user.monthlyIncome < duty.estimatedCost
     */
    private int computeMatchScore(Duties duty, User user, Set<Long> userInterestIds) {
        int score = 100;

        // Life stage mismatch: −40
        if (duty.getTargetLifeStage() != null
                && duty.getTargetLifeStage() != user.getLifeStage()) {
            score -= 40;
        }

        // No interest overlap: −30
        if (!hasInterestOverlap(duty, userInterestIds)) {
            score -= 30;
        }

        // Age outside range: −20
        if (isAgeOutOfRange(duty, user.getAge())) {
            score -= 20;
        }

        // Monthly income below estimated cost: −10
        if (duty.getEstimatedCost() != null
                && user.getMonthlyIncome() != null
                && user.getMonthlyIncome() < duty.getEstimatedCost()) {
            score -= 10;
        }

        return Math.max(0, score);
    }

    private boolean hasInterestOverlap(Duties duty, Set<Long> userInterestIds) {
        List<Interest> relatedInterests = duty.getRelatedInterests();
        if (relatedInterests == null || relatedInterests.isEmpty()) {
            // No interests attached to the duty → no penalty (not "no overlap" per se)
            return true;
        }
        return relatedInterests.stream()
                .anyMatch(i -> userInterestIds.contains(i.getId()));
    }

    private boolean isAgeOutOfRange(Duties duty, int userAge) {
        if (duty.getMinAge() != null && userAge < duty.getMinAge()) {
            return true;
        }
        if (duty.getMaxAge() != null && userAge > duty.getMaxAge()) {
            return true;
        }
        return false;
    }
}
