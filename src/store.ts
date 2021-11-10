import { createStore, IStoreDispatch, IStoreModels, IStoreRootState } from 'ice';
import resume from '@/models/resume';

interface IAppStoreModels extends IStoreModels {
  resume: typeof resume;
}
const appModels: IAppStoreModels = {
  resume,
};

export default createStore(appModels);

export type IRootDispatch = IStoreDispatch<typeof appModels>;
export type IRootState = IStoreRootState<typeof appModels>;
