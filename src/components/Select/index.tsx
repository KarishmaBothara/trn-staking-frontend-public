import { useEffect, useState } from 'react';

import { Box, Select as MSelect, MenuItem, SelectChangeEvent } from '@mui/material';
import { SxProps } from '@mui/material';

import { AssetInfo } from 'hooks/useAssets';

interface SelectProps {
  label: string;
  defaultGas: AssetInfo;
  menuItems: AssetInfo[];
  onChange: (selectedValue: AssetInfo) => void;
  ariaLabel?: string;
  sx?: SxProps;
}
/**
 * @description Select component for selecting an asset from meta data
 * @param SelectProps
 */
const Select = ({ label, menuItems, defaultGas, onChange, ariaLabel, sx }: SelectProps) => {
  const [selectAssetId, setSelectAssetId] = useState<string>(defaultGas.assetId);

  useEffect(() => {
    onChange(defaultGas);
    setSelectAssetId(defaultGas.assetId);
  }, [defaultGas, onChange]);

  const handleOnChange = (event: SelectChangeEvent<unknown>) => {
    const _selectAssetId = event.target.value as string;
    const selectedAsset: AssetInfo | undefined = menuItems.find(
      (item) => item.assetId === _selectAssetId
    );

    if (selectedAsset) {
      setSelectAssetId(_selectAssetId);
      onChange(selectedAsset);
    }
  };

  return (
    <Box sx={sx}>
      <MSelect
        labelId={`${label}-selection`}
        id={`${label}-select`}
        value={selectAssetId}
        defaultValue={selectAssetId}
        onChange={handleOnChange}
        aria-labelledby={`${label}-select-label`}
        aria-label={ariaLabel}
        sx={{
          width: '100%',
          ...sx,
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: '15rem',
            },
          },
        }}
      >
        {menuItems.map((item) => (
          <MenuItem key={item.assetId} value={item.assetId} aria-label={`Option ${item.name}`}>
            {item.symbol}
          </MenuItem>
        ))}
      </MSelect>
    </Box>
  );
};

export default Select;
