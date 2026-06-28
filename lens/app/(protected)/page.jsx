"use client";

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProfileStrip from '@/components/feed/ProfileStrip';
import FeedFilterBar from '@/components/feed/FeedFilterBar';
import RecommendationGrid from '@/components/feed/RecommendationGrid';
import {
  fetchRecommendations, fetchUserProfile,
  setFeedFilter, loadMoreRecommendations,
} from '@/redux/actions/feed.actions';

const FILTER_LABELS = {
  personalized: 'All',
  'life-stage': 'Life Stage',
  interests:    'Interests',
  critical:     'Critical',
};

export default function FeedPage() {
  const dispatch = useDispatch();
  const { recommendations, loading, error, activeFilter, userProfile, profileLoading } =
    useSelector((state) => state.feed);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const liveRef = useRef(null);

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchRecommendations('personalized'));
  }, [dispatch]);

  useEffect(() => {
    if (!loading && liveRef.current) {
      const label = FILTER_LABELS[activeFilter] ?? activeFilter;
      liveRef.current.textContent =
        `Showing ${recommendations.length} recommendations for ${label}`;
    }
  }, [recommendations, activeFilter, loading]);

  const handleFilterChange = (filter) => dispatch(setFeedFilter(filter));
  const handleRetry        = ()       => dispatch(fetchRecommendations(activeFilter));
  const handleSwitchToAll  = ()       => dispatch(setFeedFilter('personalized'));
  const handleLoadMore     = async () => {
    setLoadMoreLoading(true);
    await dispatch(loadMoreRecommendations());
    setLoadMoreLoading(false);
  };

  const showLoadMore =
    activeFilter === 'personalized' &&
    recommendations.length === 20 &&
    !loading;

  return (
    <>
      <div ref={liveRef} aria-live="polite" aria-atomic="true" className="sr-only" />
      <ProfileStrip userProfile={userProfile} profileLoading={profileLoading} />
      <FeedFilterBar activeFilter={activeFilter} onFilterChange={handleFilterChange} />
      <RecommendationGrid
        recommendations={recommendations}
        loading={loading}
        error={error}
        activeFilter={activeFilter}
        onRetry={handleRetry}
        onSwitchToAll={handleSwitchToAll}
        onLoadMore={handleLoadMore}
        showLoadMore={showLoadMore}
        loadMoreLoading={loadMoreLoading}
      />
    </>
  );
}
