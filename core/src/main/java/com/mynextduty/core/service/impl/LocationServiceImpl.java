package com.mynextduty.core.service.impl;

import com.mynextduty.core.dto.SuccessResponseDto;
import com.mynextduty.core.dto.location.UpdateLocationRequestDto;
import com.mynextduty.core.dto.projection.NearbyUserLocation;
import com.mynextduty.core.dto.user.UserResponseDto;
import com.mynextduty.core.entity.User;
import com.mynextduty.core.entity.UserLocation;
import com.mynextduty.core.repository.UserLocationRepository;
import com.mynextduty.core.repository.UserRepository;
import com.mynextduty.core.service.CurrentUserService;
import com.mynextduty.core.service.LocationService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.io.WKTReader;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class LocationServiceImpl implements LocationService {

  private final UserLocationRepository userLocationRepository;
  private final GeometryFactory geometryFactory = new GeometryFactory();
  private final CurrentUserService currentUserService;
  private final UserRepository userRepository;

  @Override
  @Transactional
  public SuccessResponseDto<UserResponseDto> updateUserLocation(
      Long userId, UpdateLocationRequestDto req) {
    User user = userRepository.getReferenceById(userId);
    UserLocation loc =
        userLocationRepository
            .findByUserId(user.getId())
            .orElse(UserLocation.builder().user(user).build());
    loc.setUser(user);
    loc.setLocation(
        geometryFactory.createPoint(new Coordinate(req.getLongitude(), req.getLatitude())));
    userLocationRepository.save(loc);
    return SuccessResponseDto.<UserResponseDto>builder()
        .message("Location updated successfully")
        .status(201)
        .build();
  }

  @Override
  @Transactional
  public SuccessResponseDto<List<UserResponseDto>> getNearByUsers(Long userId) {
    double radiusMeters = 3_000; // 5KM
    return SuccessResponseDto.<List<UserResponseDto>>builder()
        .message("Nearby users fetched successfully")
        .status(200)
        .data(
            userLocationRepository.findNearbyUserLocations(userId, radiusMeters).stream()
                .map(this::maptoUserResponseDto)
                .toList())
        .build();
  }

  private UserResponseDto maptoUserResponseDto(NearbyUserLocation n) {
    try {
      Point p = (Point) new WKTReader().read(n.getLocation());
      return UserResponseDto.builder()
          .id(n.getUserId())
          .firstName(n.getFirstname())
          .lastName(n.getLastname())
          .email(n.getEmail())
          .latitude(p.getY())
          .longitude(p.getX())
          .build();

    } catch (Exception e) {
      throw new RuntimeException("Invalid geometry", e);
    }
  }
}
