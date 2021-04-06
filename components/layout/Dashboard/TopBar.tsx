import React from 'react';
import clsx from 'clsx';
import { createStyles, Theme, makeStyles, fade } from '@material-ui/core/styles';
import { AppBar, Toolbar, Hidden, IconButton, Icon, Box, Avatar } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import HomeIcon from '@material-ui/icons/Home';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/client';

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            boxShadow: 'none',
            backdropFilter: 'blur(8px)',
            backgroundColor: fade(theme.palette.background.default, 0.72),
            [theme.breakpoints.up('lg')]: {
                paddingLeft: DRAWER_WIDTH
            }
        },
        toolbar: {
            minHeight: APPBAR_MOBILE,
            [theme.breakpoints.up('md')]: {
                padding: theme.spacing(0, 5)
            },
            [theme.breakpoints.up('lg')]: {
                minHeight: APPBAR_DESKTOP
            }
        },
        menu: {
            marginRight: theme.spacing(1),
            color: theme.palette.text.primary,
        },
        settings: {
            display: 'flex',
            alignItems: 'center',
            '& > *:not(:first-of-type)': {
                ml: {
                    xs: 0.5,
                    sm: 2,
                    lg: 3
                }
            }
        }
    }),
)

type Props = {
    onOpenNav: () => void,
    className?: string,
}

const TopBar: React.FC<Props> = ({ onOpenNav, className }) => {
    const classes = useStyles();
    const router = useRouter();

    return (
        <AppBar className={clsx(classes.root, className)}>
            <Toolbar className={classes.toolbar}>
                <Hidden lgUp>
                    <IconButton
                        onClick={onOpenNav}
                        className={classes.menu}
                    >
                        <MenuIcon />
                    </IconButton>
                </Hidden>

                <Box flexGrow={1} />

                <Box className={classes.settings}>
                    <IconButton disabled={true}>
                        <NotificationsIcon />
                    </IconButton>

                    <IconButton onClick={() => router.push('/')} title="Startseite">
                        <HomeIcon />
                    </IconButton>

                    <IconButton onClick={() => signOut({ callbackUrl: '/' })} title="Abmelden">
                        <ExitToAppIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default TopBar;