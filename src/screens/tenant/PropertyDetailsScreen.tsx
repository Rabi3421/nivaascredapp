import React, { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppCard } from '../../components/AppCard';
import { AppInput } from '../../components/AppInput';
import { ScreenHeader } from '../../components/ScreenHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { properties } from '../../data/mockData';
import { colors } from '../../theme/colors';
import { formatCurrency } from '../../utils/format';
import Screen from '../shared/Screen';
import { ModalSheet } from '../shared/ModalSheet';

export default function PropertyDetailsScreen({ route, navigation }: any) {
  const [applyOpen, setApplyOpen] = useState(false);
  const property = useMemo(
    () => properties.find(item => item.id === route.params?.propertyId) ?? properties[0],
    [route.params?.propertyId],
  );

  return (
    <Screen>
      <ScreenHeader title="Property details" subtitle="Verified listing preview with landlord trust summary." />
      <Image source={{ uri: property.imageUrl }} style={styles.image} />
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        <StatusBadge label={property.status} tone="success" />
        {property.verificationStatus === 'approved' ? <StatusBadge label="verified property" tone="info" /> : null}
      </View>
      <Text style={styles.title}>{property.title}</Text>
      <Text style={styles.address}>{property.address}</Text>
      <Text style={styles.price}>{formatCurrency(property.rentAmount)}/month</Text>
      <AppCard>
        <Text style={styles.section}>Amenities</Text>
        <Text style={styles.body}>{property.amenities.join('  |  ')}</Text>
      </AppCard>
      <AppCard>
        <Text style={styles.section}>Landlord</Text>
        <Text style={styles.body}>{property.landlordName} - NivaasCred Score {property.landlordScore}</Text>
      </AppCard>
      <AppButton title="Apply for this property" onPress={() => setApplyOpen(true)} />
      <AppButton title="Back" variant="ghost" onPress={() => navigation.goBack()} />
      <ModalSheet visible={applyOpen} title="Apply for property" onClose={() => setApplyOpen(false)}>
        <AppInput label="Message" placeholder="Introduce yourself" multiline style={{ minHeight: 90, textAlignVertical: 'top' }} />
        <AppInput label="Move-in date" placeholder="YYYY-MM-DD" />
        <AppButton title="Submit application" onPress={() => setApplyOpen(false)} />
      </ModalSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  image: { height: 220, borderRadius: 22, backgroundColor: colors.surfaceMuted },
  title: { color: colors.text, fontSize: 25, fontWeight: '900' },
  address: { color: colors.muted, lineHeight: 20 },
  price: { color: colors.primary, fontSize: 24, fontWeight: '900' },
  section: { color: colors.text, fontWeight: '900', fontSize: 16, marginBottom: 6 },
  body: { color: colors.muted, lineHeight: 21 },
});
