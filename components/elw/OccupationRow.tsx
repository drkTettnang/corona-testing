import React, { useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { SlotInfo } from '../../lib/swr';
import { Button, CircularProgress, IconButton, TableCell, TableRow, TextField } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import { green, red } from '@material-ui/core/colors';
import axios from 'axios';
import { mutate } from 'swr';
import { Location } from '@prisma/client';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        bar: {
            minWidth: 100,
            width: '100%',
            height: '1em',
            backgroundColor: red[500],
            '& div': {
                height: '100%',
                backgroundColor: green[500],
            }
        }
    }),
)

type Props = {
    dateString: string
    slotInfo: SlotInfo
    location: Location
}

const OccupationRow: React.FC<Props> = ({ dateString, slotInfo, location }) => {
    const classes = useStyles();
    const date = new Date(dateString);
    const availablePercentage = 1 - (slotInfo.occupied / slotInfo.seats);
    const [isEditMode, setEditMode] = useState(false);
    const [isDeleteMode, setDeleteMode] = useState(false);
    const [isProcessing, setProcessing] = useState(false);
    const [seats, setSeats] = useState(slotInfo.seats);

    const onSubmit = () => {
        setProcessing(true);

        axios.post(`/api/slot/${slotInfo.id}`, {
            seats,
        }).then((response) => {
            console.log('success', response.data);

            return mutate(`/api/location/${location.id}/slot`);
        }).catch(err => {
            console.log('error', err);
        }).then(() => {
            setEditMode(false);
            setProcessing(false);
        });
    };

    const onDelete = () => {
        setProcessing(true);

        axios.delete(`/api/slot/${slotInfo.id}`).then((response) => {
            console.log('success', response.data);

            return mutate(`/api/location/${location.id}/slot`);
        }).catch(err => {
            console.log('error', err);

            setDeleteMode(false);
            setProcessing(false);
        });
    }

    return (
        <TableRow>
            <TableCell>{slotInfo.requireCode && <LockIcon fontSize="small" />}{date.toLocaleTimeString('de-DE')}</TableCell>
            <TableCell><div className={classes.bar}><div style={{ width: (availablePercentage * 100) + '%' }}></div></div></TableCell>
            <TableCell>{slotInfo.occupied}</TableCell>
            <TableCell>{isEditMode ?
                <TextField
                    label="Plätze"
                    variant="outlined"
                    type="number"
                    value={seats}
                    onChange={ev => setSeats(parseInt(ev.target.value, 10))}
                    size="small"
                    disabled={isProcessing}
                    InputProps={{
                        inputProps: {
                            min: slotInfo.occupied,
                            max: 100,
                        }
                    }} /> : slotInfo.seats}</TableCell>
            <TableCell align="right">
                {!isEditMode && !isDeleteMode && <>
                    <IconButton aria-label="edit" component="span" onClick={() => setEditMode(true)}><EditIcon /></IconButton>
                    {slotInfo.occupied === 0 && <IconButton aria-label="delete" component="span" color="primary" onClick={() => setDeleteMode(true)}><DeleteIcon /></IconButton>}
                </>}
                {isEditMode && <IconButton aria-label="edit" component="span" onClick={() => onSubmit()} disabled={isProcessing}>{isProcessing ? <CircularProgress size="1em" color="inherit" /> : <CheckIcon />}</IconButton>}
                {isDeleteMode && slotInfo.occupied === 0 && <>
                    <Button startIcon={isProcessing ? <CircularProgress size="1em" color="inherit" /> : <DeleteIcon />} color="primary" variant="contained" disabled={isProcessing} aria-label="delete" onClick={() => onDelete()}>Löschen</Button>
                    <IconButton aria-label="close" component="span" onClick={() => setDeleteMode(false)}><CloseIcon /></IconButton>
                </>}
            </TableCell>
        </TableRow>
    );
}

export default OccupationRow;