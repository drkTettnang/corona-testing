import { Typography } from '@material-ui/core';
import React from 'react';
import Config from '../lib/Config';
import { DateSelectionIntroTemplate } from '../lib/templates';

const DateSelectionIntro: DateSelectionIntroTemplate = () => {
    return (
        <>
            <Typography variant="body1">Sie können einen Termin für bis zu {Config.MAX_ADULTS} Erwachsenen und {Config.MAX_CHILDREN} ihrer Kinder (unter 18 Jahren)
                vereinbaren. Beachten Sie, dass Kinder nur in Begleitung eines Erziehungsberichtigten getestet werden können.</Typography>
        </>
    );
}

export default DateSelectionIntro;