import { Link, Typography } from '@material-ui/core';
import React from 'react';
import Config from '../lib/Config';
import { WelcomeTextTemplate } from '../lib/templates';

const WelcomeText: WelcomeTextTemplate = () => {
    return (
        <>
            <Typography variant="h3" gutterBottom={true}>Kommunale Corona-Schnellteststation</Typography>

            <Typography variant="body1" paragraph={true}>
                Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel
                illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui
                blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem
                ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt
                ut laoreet dolore magna aliquam erat volutpat.
            </Typography>
            <Typography variant="body1" paragraph={true}>
                Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut
                aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit
                esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan
                et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te
                feugait nulla facilisi.
            </Typography>
            <Typography variant="body1" paragraph={true}>
                Weitere Informationen erhalten
                Sie auf unserer <Link href={Config.HOMEPAGE}>Corona Übersichtsseite</Link>.
            </Typography>
        </>
    );
}

export default WelcomeText;