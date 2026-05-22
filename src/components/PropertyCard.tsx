import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Property } from '../types';
import { formatCurrency } from '../utils/format';
import { colors } from '../theme/colors';
import { AppCard } from './AppCard';
import { StatusBadge, toneForStatus } from './StatusBadge';

export function PropertyCard({
  property,
  onPress,
  compact,
}: {
  property: Property;
  onPress?: () => void;
  compact?: boolean;
}) {
  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <AppCard style={styles.card}>
        <Image source={{ uri: property.imageUrl }} style={compact ? styles.thumb : styles.image} />
        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.title} numberOfLines={1}>{property.title}</Text>
            <StatusBadge
              label={property.verificationStatus === 'approved' ? 'verified' : property.status}
              tone={toneForStatus(property.verificationStatus === 'approved' ? 'approved' : property.status)}
            />
          </View>
          <Text style={styles.meta}>{property.city} - {property.propertyType}</Text>
          <Text style={styles.price}>{formatCurrency(property.rentAmount)}/mo</Text>
          <Text style={styles.meta} numberOfLines={1}>
            {property.amenities.slice(0, 3).join('  |  ')}
          </Text>
        </View>
      </AppCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { padding: 0, overflow: 'hidden' },
  image: { width: '100%', height: 150, backgroundColor: colors.surfaceMuted },
  thumb: { width: '100%', height: 92, backgroundColor: colors.surfaceMuted },
  content: { padding: 14, gap: 7 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  title: { flex: 1, color: colors.text, fontSize: 16, fontWeight: '800' },
  meta: { color: colors.muted, fontSize: 13 },
  price: { color: colors.primary, fontSize: 18, fontWeight: '900' },
});
