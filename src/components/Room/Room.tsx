import { styled } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { useAppState, useDbState } from '../../state';
import { docToMedia, MULTI } from '../../state/media/media';
import { NoMediaText } from '../Dialogs/NoMediaDialog';
import ParticipantList from '../ParticipantList/ParticipantList';
import CustomVideoPlayer from '../VideoPlayer/CustomVideoPlayer';

const Container = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '100%',
  display: 'grid',
  gridTemplateColumns: `1fr ${theme.sidebarWidth}px`,
  gridTemplateRows: '100%',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: `100%`,
    gridTemplateRows: `1fr ${theme.sidebarMobileHeight + 16}px`,
  },
}));

export default function Room() {
  const [hasInit, setHasInit] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState(NoMediaText.NO_FILE);

  const { db, setInDb, getFromDb } = useDbState();
  const { localMedia, remoteMedia, user, dispatchRemoteMedia, dispatchLocalMedia } = useAppState();
  const { room } = useVideoContext();

  useEffect(() => {
    console.log('Room effect');
    if (!hasInit) {
      setHasInit(true);

      // Add a listener for remote media changes
      // FIX IF DATA NOT EXISTS
      db.collection('rooms')
        .doc(room.name)
        .onSnapshot(
          function(doc) {
            if (doc.data()) {
              dispatchLocalMedia({
                name: MULTI,
                value: { playing: doc.data()!.playing, timestamp: doc.data()!.timestamp },
              });

              if (!doc.data()!.url)
                // data reset, reset the remote media too
                dispatchRemoteMedia({ name: MULTI, value: { ...docToMedia(doc.data()) } });
            }
          },
          function(error) {
            console.log(error.message);
          }
        );

      getFromDb(db, room.name)
        .then((doc: any) => {
          if (doc.exists) {
            // someone already in room, match that data
            dispatchRemoteMedia({ name: MULTI, value: { ...docToMedia(doc.data()) } });
          } else {
            // No one in the room, init it
            setInDb(db, room.name, { ...remoteMedia })
              .then(function() {
                console.log('inited empty room');
              })
              .catch((error: any) => {
                console.error('Error writing document: ', error);
                setHasInit(false);
              });
          }
        })
        .catch((error: any) => {
          console.error('Error writing document: ', error);
          setHasInit(false);
        });
    }

    console.log(localMedia);
    console.log(remoteMedia);

    if (!(localMedia.fileName && remoteMedia.fileName)) {
      // nothing loaded, prompt user to load something
      setDialogMessage(NoMediaText.NO_FILE);
      setShowDialog(true);
    } else if (localMedia.fileName !== remoteMedia.fileName) {
      // fileName mismatch, prompt to load new file
      setDialogMessage(NoMediaText.NO_MATCH);
      setShowDialog(true);
    } else setShowDialog(false);
  }, [remoteMedia, localMedia.fileName]);

  return (
    <Container>
      <CustomVideoPlayer />
      <ParticipantList />
      {/* {showDialog && <NoMediaDialog text={dialogMessage} />} */}
    </Container>
  );
}
