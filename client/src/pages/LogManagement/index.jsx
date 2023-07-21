import { Pagination, Typography } from '@mui/material';
import { Box } from '@mui/system';
import logApi from 'api/logApi';
import ShowAlert from 'components/Alert';
import Loading from 'components/Loading';
import Table from 'components/Table';
import { useEffect, useState } from 'react';

export default function LogManagement() {
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [listLog, setListLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 8,
    total: 10,
  });

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const res = await logApi.list();
        setPagination({ ...pagination, total: Math.ceil(res.data.length / pagination.size) });
        setListLog(
          res.data.map((log) => ({
            ...log?.user,
            id: log?.id,
            action: log?.action,
            createdAt: new Date(log?.createdAt).toLocaleString('en-GB', { hour12: false }),
          }))
        );
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setAlert({ message: 'Get logs failed!', type: 'error' });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseAlert = (event, reason) => {
    return reason === 'clickaway' ? null : setAlert({ ...alert, message: '' });
  };

  const head = ['Log ID', 'Name', 'Role', 'Action', 'Time'];
  const table = {
    head,
    body: listLog.slice(pagination.page * pagination.size, (pagination.page + 1) * pagination.size),
  };

  const handleChangePage = (event, page) => {
    if (page === pagination.page - 1) return;
    setPagination({ ...pagination, page: page - 1 });
  };

  return (
    <Box sx={{ p: 4, flex: 1, bgcolor: '#eee' }}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='h5'>Log Management</Typography>
          </Box>
          <Box sx={{ mt: 5 }}>
            <Table table={table} checkbox={false} />
          </Box>

          <Pagination
            sx={{ mb: 5, mt: 5, '& ul': { justifyContent: 'center' } }}
            count={pagination.total}
            page={pagination.page + 1}
            onChange={handleChangePage}
          />
        </>
      )}
      <ShowAlert alert={alert} onClose={handleCloseAlert} />
    </Box>
  );
}
