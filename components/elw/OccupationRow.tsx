import React, { useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { SlotInfo } from '../../lib/swr';
import { CircularProgress, IconButton, TableCell, TableRow, TextField } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import { green, red } from '@material-ui/core/colors';
import axios from 'axios';
import { mutate } from 'swr';

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
}

const OccupationRow: React.FC<Props> = ({ dateString, slotInfo }) => {
    const classes = useStyles();
    const date = new Date(dateString);
    const availablePercentage = 1 - (slotInfo.occupied / slotInfo.seats);
    const [isEditMode, setEditMode] = useState(false);
    const [isProcessing, setProcessing] = useState(false);
    const [seats, setSeats] = useState(slotInfo.seats);

    const onSubmit = () => {
        setProcessing(true);

        axios.post(`/api/elw/slot/${slotInfo.id}`, {
            seats,
        }).then((response) => {
            console.log('success', response.data);

            return mutate('/api/dates');
        }).catch(err => {
            console.log('error', err);
        }).then(() => {
            setEditMode(false);
            setProcessing(false);
        });
    };

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
            <TableCell width={48}>
                {!isEditMode && <IconButton aria-label="edit" component="span" onClick={() => setEditMode(true)}><EditIcon /></IconButton>}
                {isEditMode && <IconButton aria-label="edit" component="span" onClick={() => onSubmit()} disabled={isProcessing}>{isProcessing ? <CircularProgress size="1em" color="inherit" /> : <CheckIcon />}</IconButton>}
            </TableCell>
        </TableRow>
    );
}

export default OccupationRow;