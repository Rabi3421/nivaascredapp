import React from 'react';
import { Text } from 'react-native';
import { ReviewCard } from '../../components/ReviewCard';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionHeader } from '../../components/SectionHeader';
import { reviews } from '../../data/mockData';
import Screen from '../shared/Screen';

export default function LandlordReviewsScreen() {
  return (
    <Screen>
      <ScreenHeader title="Reviews" subtitle="Received, given, and requested reviews." />
      <SectionHeader title="Received" />
      {reviews.slice(1).map(item => <ReviewCard key={item.id} review={item} />)}
      <SectionHeader title="Given" />
      {reviews.slice(0, 1).map(item => <ReviewCard key={item.id} review={item} />)}
      <SectionHeader title="Requests" />
      <Text>Please review Rahul Kumar for Bright 2BHK near Metro.</Text>
    </Screen>
  );
}
