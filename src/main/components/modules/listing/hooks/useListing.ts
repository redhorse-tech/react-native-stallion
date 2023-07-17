import { useCallback, useContext, useEffect, useMemo } from 'react';

import {
  CARD_TYPES,
  IS_ANDROID,
  VERSION_PREFIX,
} from '@main/constants/appConstants';
import { GlobalContext } from '@main/state';
import { IBucketCard } from '../components/BucketCard';
import { IBundleCard } from '../components/BundleCard';

const useListing = () => {
  const {
    bucketState,
    bundleState,
    actions: { fetchBuckets, fetchBundles, selectBucket },
  } = useContext(GlobalContext);
  const bundlesListingEnabled = useMemo(
    () => (bundleState.selectedBucketId ? true : false),
    [bundleState.selectedBucketId]
  );
  const listingLoading = useMemo(() => {
    if (bundlesListingEnabled) return bundleState.isLoading;
    return bucketState.isLoading;
  }, [bucketState.isLoading, bundleState.isLoading, bundlesListingEnabled]);

  const listingData = useMemo<(IBucketCard | IBundleCard)[]>(() => {
    if (bundlesListingEnabled) {
      return (
        bundleState?.data?.map((bundleData) => ({
          type: CARD_TYPES.BUNDLE,
          id: bundleData.id,
          version: bundleData.version,
          name: `${VERSION_PREFIX}${bundleData.version}`,
          description: bundleData.releaseNote,
          updatedAt: bundleData.updatedAt,
          author: bundleData.author.fullName,
        })) || []
      );
    }
    return (
      bucketState.data?.map((bucketItem) => ({
        type: CARD_TYPES.BUCKET,
        id: bucketItem.id,
        name: bucketItem.name,
        updatedAt: bucketItem.updatedAt,
        bundleCount:
          (IS_ANDROID
            ? bucketItem?.latestAndroidBundleVersion
            : bucketItem?.latestIosBundleVersion) || 0,
      })) || []
    );
  }, [bucketState.data, bundleState.data, bundlesListingEnabled]);
  const listingError = useMemo(() => {
    if (bundlesListingEnabled) return bundleState.error;
    return bucketState.error;
  }, [bucketState.error, bundleState.error, bundlesListingEnabled]);
  const fetchListing = useCallback(() => {
    if (bundlesListingEnabled) {
      fetchBundles();
    } else {
      fetchBuckets();
    }
  }, [fetchBuckets, fetchBundles, bundlesListingEnabled]);

  const setBucketSelection = useCallback(
    (bucketId?: string | null) => {
      selectBucket(bucketId);
      fetchBundles(bucketId);
    },
    [selectBucket, fetchBundles]
  );

  useEffect(() => {
    fetchListing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    listingData,
    listingError,
    listingLoading,
    fetchListing,
    setBucketSelection,
  };
};

export default useListing;
