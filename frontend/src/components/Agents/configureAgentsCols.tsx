import React from 'react';
import BaseIcon from '../BaseIcon';
import { mdiEye, mdiTrashCan, mdiPencilOutline } from '@mdi/js';
import axios from 'axios';
import {
  GridActionsCellItem,
  GridRowParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import ImageField from '../ImageField';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import DataGridMultiSelect from '../DataGridMultiSelect';

import { hasPermission } from '../../helpers/userPermissions';

type Params = (id: string) => void;

export const loadColumns = async (
  onDelete: Params,
  onView: Params,
  onEdit: Params,
  entityName: string,

  user,
) => {
  async function callOptionsApi(entityName: string) {
    if (!hasPermission(user, 'READ_' + entityName.toUpperCase())) return [];

    try {
      const data = await axios(`/${entityName}/autocomplete?limit=100`);
      return data.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  const hasUpdatePermission = hasPermission(user, 'UPDATE_AGENTS');

  return [
    {
      field: 'user',
      headerName: 'User',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: hasUpdatePermission,

      sortable: false,
      type: 'singleSelect',
      getOptionValue: (value: any) => value?.id,
      getOptionLabel: (value: any) => value?.label,
      valueOptions: await callOptionsApi('users'),
      valueGetter: (params: GridValueGetterParams) =>
        params?.value?.id ?? params?.value,
    },

    {
      field: 'business_info',
      headerName: 'BusinessInformation',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: hasUpdatePermission,
    },

    {
      field: 'contact_details',
      headerName: 'ContactDetails',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: hasUpdatePermission,
    },

    {
      field: 'musicians',
      headerName: 'Musicians',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: false,
      sortable: false,
      type: 'singleSelect',
      valueFormatter: ({ value }) =>
        dataFormatter.musiciansManyListFormatter(value).join(', '),
      renderEditCell: (params) => (
        <DataGridMultiSelect {...params} entityName={'musicians'} />
      ),
    },

    {
      field: 'jobs',
      headerName: 'Jobs',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: false,
      sortable: false,
      type: 'singleSelect',
      valueFormatter: ({ value }) =>
        dataFormatter.jobsManyListFormatter(value).join(', '),
      renderEditCell: (params) => (
        <DataGridMultiSelect {...params} entityName={'jobs'} />
      ),
    },

    {
      field: 'Contact_Email',
      headerName: 'Contact Email',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: hasUpdatePermission,
    },

    {
      field: 'Contact_Number',
      headerName: 'Contact Number',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: hasUpdatePermission,
    },

    {
      field: 'Business_Name',
      headerName: 'Business Name',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: hasUpdatePermission,
    },

    {
      field: 'Address',
      headerName: 'Address',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: hasUpdatePermission,
    },

    {
      field: 'actions',
      type: 'actions',
      minWidth: 30,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',
      getActions: (params: GridRowParams) => {
        const actions = [
          <GridActionsCellItem
            key={1}
            icon={<BaseIcon path={mdiEye} size={24} />}
            onClick={() => onView(params?.row?.id)}
            label='View'
            showInMenu
          />,
        ];

        if (hasUpdatePermission) {
          actions.push(
            <GridActionsCellItem
              key={2}
              icon={<BaseIcon path={mdiPencilOutline} size={24} />}
              onClick={() => onEdit(params?.row?.id)}
              label='Edit'
              showInMenu
            />,
          );
        }

        if (hasUpdatePermission) {
          actions.push(
            <GridActionsCellItem
              key={3}
              icon={<BaseIcon path={mdiTrashCan} size={24} />}
              onClick={() => onDelete(params?.row?.id)}
              label='Delete'
              showInMenu
            />,
          );
        }

        return actions;
      },
    },
  ];
};
