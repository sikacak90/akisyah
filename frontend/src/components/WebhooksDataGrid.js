import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionContext } from '../features/Session';
import { BASE_URL, URL_ID_LENGTH } from '../utils/constants';

var rows = [];
const columns = [
  { field: 'id', headerName: 'ID', width: '230' },
  {
    field: 'name',
    headerName: 'Name',
    width: '100',
  },
  {
    field: 'url',
    headerName: 'URL',
    width: '360',
  },
  {
    field: 'type',
    headerName: 'Event Type',
    width: '100',
  },
  {
    field: 'isOpen',
    headerName: 'Status',
    description: 'This column has a value getter and is not sortable.',
    width: '100',
  },
];

export default function WebhooksDataGrid({ apiRef }) {
  const { session } = useContext(sessionContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (session.isLoggedIn) {
      session.userData.webhooks.forEach((webhook) => {
        apiRef.current.updateRows([
          {
            id: webhook._id,
            name: webhook.name,
            url: BASE_URL + webhook.URL,
            type: webhook.EventType,
            isOpen: 'open',
          },
        ]);
      });
    }
  }, [session, apiRef]);

  return (
    <Box
      sx={{
        height: 460,
        width: '100%',
        marginTop: '1rem',
        '& .open': {
          backgroundColor: 'rgba(239, 251, 244, 1)',
          color: '#20A144',
          textAlign: 'center',
          cursor: 'pointer',
        },
        '& .close': {
          backgroundColor: '#ff943975',
          color: 'red',
          cursor: 'pointer',
        },
        '& .grid-row': {
          cursor: 'pointer',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        apiRef={apiRef}
        onCellClick={(params) => {
          if (params.field === 'url') {
            navigator.clipboard.writeText(params.row.url);
            alert('Link copied to clipboard.');
            return;
          }
          if (params.field === '__check__') return;
          if (params.field === 'isOpen') {
            navigate(
              '/list/' +
                params.row.type +
                '/' +
                params.row.id.slice(URL_ID_LENGTH),
              {
                state: { name: params.row.name },
              }
            );
            return;
          }
        }}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        getCellClassName={(params) => {
          if (params.field === 'isOpen') {
            return params.value;
          }
          if (params.field === 'url') {
            return 'url';
          }
          return '';
        }}
        getRowClassName={() => {
          return 'grid-row';
        }}
        checkboxSelection
      />
    </Box>
  );
}
