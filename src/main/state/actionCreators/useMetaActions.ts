import React, { useCallback, useEffect } from 'react';

import { getStallionMetaNative } from '../../utils/StallionNaitveUtils';
import { setMeta } from '../actions/metaActions';

import { IMetaAction } from '../../../types/meta.types';

const useMetaActions = (dispatch: React.Dispatch<IMetaAction>) => {
  const refreshMeta = useCallback(async () => {
    const stallionMeta = await getStallionMetaNative();
    dispatch(setMeta(stallionMeta));
  }, [dispatch]);

  useEffect(() => {
    refreshMeta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    refreshMeta,
  };
};

export default useMetaActions;
