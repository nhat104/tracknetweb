import { Box, Button, CircularProgress, Grid, Input, Typography } from '@mui/material';
import logApi from 'api/logApi';
import axios from 'axios';
import ShowAlert from 'components/Alert';
import { useState } from 'react';
import ReactPlayer from 'react-player';

export default function TrackNet() {
  const imageMimeType = /image\/(png|jpg|jpeg)/i;

  const [alert, setAlert] = useState({ message: '', type: '' });
  const [videoFile, setVideoFile] = useState({ url: '', file: null });
  const [imageFile, setImageFile] = useState({ url: '', file: null });
  const [loading, setLoading] = useState(false);

  const [trackResult, setTrackResult] = useState('');

  const handleFileChange = (event) => {
    setVideoFile(null);
    // const ext = event.target.files[0].name.split('.').pop();
    // console.log(ext);
    const file = event.target.files[0];
    setTrackResult('');
    if (file.type.match(imageMimeType)) {
      console.log('image');
      setVideoFile({ url: '', file: null });
      setImageFile({ url: URL.createObjectURL(file), file });
    } else {
      console.log('video');
      setImageFile({ url: '', file: null });
      setVideoFile({ url: URL.createObjectURL(file), file });
    }
  };

  const handleTrackNet = async () => {
    try {
      setLoading(true);
      setTrackResult('');
      const formData = new FormData();
      formData.append('file', videoFile?.file ? videoFile.file : imageFile.file);
      const res = await axios.post('http://localhost:5000/uploader', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res.data);
      await logApi.add(imageFile.url ? 'TrackNet image' : 'TrackNet video');
      setLoading(false);
      setTrackResult(res.data?.image_path || res.data?.video_path || '');
      if (res.data?.message) {
        setAlert({ message: res.data.message, type: 'error' });
      }
    } catch (error) {
      setLoading(false);
      setAlert({ message: error.message, type: 'error' });
    }
  };

  const handleCloseAlert = (event, reason) => {
    return reason === 'clickaway' ? null : setAlert({ ...alert, message: '' });
  };

  return (
    <Box sx={{ px: 3 }}>
      <Input
        sx={{ display: 'none' }}
        id='icon-button-file'
        type='file'
        inputProps={{ accept: 'video/*,image/*' }}
        onChange={handleFileChange}
      />

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6}>
          <Box component='label' htmlFor='icon-button-file'>
            <Button color='primary' component='span' variant='contained'>
              Upload
            </Button>
          </Box>
          <Box
            sx={{
              border: '1px solid black',
              minHeight: !videoFile?.url && !imageFile?.url && '60vh',
              mt: 3,
              '& img': {
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              },
            }}
          >
            {videoFile?.url && (
              <ReactPlayer
                width='100%'
                height='60%'
                url={videoFile.url}
                muted={true}
                playing={true}
                controls={false}
              />
            )}
            {imageFile?.url && <img src={imageFile.url} alt='' />}
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box>
            <Button color='primary' variant='contained' disabled={loading} onClick={handleTrackNet}>
              TrackNet
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid black',
              minHeight: !trackResult.length && '60vh',
              mt: 3,
              '& img': {
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              },
            }}
          >
            {loading && <CircularProgress color='primary' />}
            {videoFile?.url && trackResult && (
              <ReactPlayer
                width='100%'
                height='60%'
                url={trackResult}
                muted={true}
                playing={true}
                controls={false}
              />
            )}
            {imageFile?.url && trackResult && <img src={trackResult} alt='' />}
          </Box>
        </Grid>
        {/* <Grid item xs={12} sm={6} md={4}>
          <Typography>Coordinates</Typography>
          <Typography>X: </Typography>
          <Typography>Y: </Typography>
        </Grid> */}
      </Grid>

      <ShowAlert alert={alert} onClose={handleCloseAlert} />
    </Box>
  );
}
