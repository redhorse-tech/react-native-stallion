import React, { memo } from 'react';
import { RefreshControl, FlatList } from 'react-native';

import useListing from './hooks/useListing';

import ErrorView from '../../../components/common/ErrorView';
import BucketCard, { IBucketCard } from './components/BucketCard';
import {
  CARD_TYPES,
  END_REACH_THRESHOLD,
} from '../../../constants/appConstants';
import BundleCard, { IBundleCard } from './components/BundleCard';
import FooterLoader from '../../common/FooterLoader';

import styles from './styles';

const Listing: React.FC = () => {
  const {
    listingData,
    listingLoading,
    listingError,
    fetchListing,
    setBucketSelection,
    fetchNextPage,
    nextPageLoading,
  } = useListing();
  if (listingError) {
    return <ErrorView error={listingError} />;
  }
  return (
    <FlatList
      style={styles.mainContainer}
      contentContainerStyle={styles.mainListContainer}
      refreshControl={
        <RefreshControl refreshing={listingLoading} onRefresh={fetchListing} />
      }
      data={listingData}
      renderItem={({ item }) => (
        <BucketOrBundle
          key={item.id}
          data={item}
          setBucketSelection={setBucketSelection}
        />
      )}
      keyExtractor={(item) => item.id}
      ListFooterComponent={nextPageLoading ? <FooterLoader /> : null}
      onEndReached={fetchNextPage}
      onEndReachedThreshold={END_REACH_THRESHOLD}
    />
  );
};

export default memo(Listing);

interface IBucketOrBundle {
  data: IBucketCard | IBundleCard;
  setBucketSelection: (bucketId?: string | null | undefined) => void;
}

const BucketOrBundle: React.FC<IBucketOrBundle> = memo(
  ({ data, setBucketSelection }) => {
    return data?.type === CARD_TYPES.BUCKET ? (
      <BucketCard
        key={data.id}
        {...data}
        handlePress={() => setBucketSelection(data.id)}
      />
    ) : (
      (data?.type === CARD_TYPES.BUNDLE && (
        <BundleCard key={data.id} {...data} />
      )) ||
        null
    );
  }
);
