import React, { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat, IScannerControls } from '@zxing/browser';
import { createStyles, makeStyles } from '@material-ui/core';
import classnames from 'classnames';

const useStyles = makeStyles(() =>
    createStyles({
        fullscreen: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#000',
        }
    }),
)

type Props = {
    onText: (text: string) => void,
    fullscreen?: boolean,
    vibrate?: boolean,
}

const Scanner: React.FC<Props> = ({onText, fullscreen = false, vibrate = true}) => {
    const classes = useStyles();
    const videoElement = useRef<HTMLVideoElement>();
    const controlRef = useRef<IScannerControls>();

    useEffect(() => {
        const hints = new Map();
        hints.set(2, [BarcodeFormat.QR_CODE, BarcodeFormat.CODE_39]);

        const reader = new BrowserMultiFormatReader();

        reader.setHints(hints);

        reader.decodeFromVideoDevice(null, videoElement.current, (result, error) => {
            if (result) {
                onText(result.getText());

                if (('vibrate' in navigator) && vibrate) {
                    navigator.vibrate(500);
                }
            }
        }).then(controls => {
            controlRef.current = controls;
        });

        return () => {
            if (controlRef.current) {
                controlRef.current.stop();
            }
        }
    }, []);

    return (
        <video ref={videoElement} width="300" height="200" className={classnames({[classes.fullscreen]: fullscreen})} />
    )
}

export default Scanner;