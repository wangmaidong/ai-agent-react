function abcUseAutoTable() {
  const autoTable = {};

  globalAutoModuleRegistration.sort()
    .forEach(item => {
      Object.assign(autoTable, item.use(autoTable));
    });
}

export const globalAutoModuleRegistration = [
  { seq: 1, key: "config", use: useAutoTableConfig },
  { seq: 2, key: "state", use: useAutoTableState },
  { seq: 3, key: "handler", use: useAutoTableHandler },
];

import {globalAutoModuleRegistration} from 'pack'
globalAutoModuleRegistration.push({
  seq: 99,
  key: "batch_delete",
  use: useAutoTableBatchDelete,
});
