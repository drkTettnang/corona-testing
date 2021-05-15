import React, { useEffect } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Hidden, Drawer, Box, Link, List, Typography, Avatar, CircularProgress } from '@material-ui/core';
import Image from 'next/image';
import Config from '../../../lib/Config';
import { useRouter } from 'next/router';
import RouterLink from 'next/link';
import { useSession } from 'next-auth/client';
import NavItem from './NavItem';
import { grey } from '@material-ui/core/colors';
import RoomIcon from '@material-ui/icons/Room';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import { useLocations } from '../../../lib/swr';

const DRAWER_WIDTH = 280;

const RoleTranslation = {
    user: 'Benutzer',
    moderator: 'Moderator',
    admin: 'Administrator',
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        drawer: {
            [theme.breakpoints.up('lg')]: {
                flexShrink: 0,
                width: DRAWER_WIDTH
            }
        },
        drawerPaper: {
            width: DRAWER_WIDTH,
            background: theme.palette.background.default
        },
        subHeader: {
            ...theme.typography.overline,
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(2),
            paddingLeft: theme.spacing(5),
            color: theme.palette.text.primary
        },
        account: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(2, 1.5),
            margin: theme.spacing(1, 2.5, 5),
            borderRadius: theme.shape.borderRadius,
            background: grey[100],
        },
        primary: {
            color: theme.palette.text.primary,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        secondary: {
            color: theme.palette.text.secondary,
        },
        logoContainer: {
            margin: theme.spacing(3, 3),
        },
        doc: {
            borderRadius: 12,
            margin: theme.spacing(1),
        },
        content: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
        }
    }),
)

type Item = { title: string, href: string, info?: JSX.Element, icon?: JSX.Element, items?: Item[] };

function reduceChild({ array, item, pathname, level }: { array: JSX.Element[], item: Item, pathname: string, level: number }) {
    const key = item.href + level;

    if (item.items && item.items.length > 0) {
        array = [
            ...array,
            <NavItem
                key={key}
                level={level}
                icon={item.icon}
                info={item.info}
                href={item.href}
                title={item.title}
            >
                {renderNavItems({
                    pathname,
                    level: level + 1,
                    items: item.items
                })}
            </NavItem>
        ];
    } else {
        array = [
            ...array,
            <NavItem
                key={key}
                level={level}
                href={item.href}
                icon={item.icon}
                info={item.info}
                title={item.title}
            />
        ];
    }

    return array;
}

function renderNavItems({ items, pathname, level = 0 }: { items: Item[], pathname: string, level: number }) {
    return (
        <List disablePadding>
            {items.reduce(
                (array, item) => reduceChild({ array, item, pathname, level }),
                []
            )}
        </List>
    );
}

type Props = {
    isOpenNav: boolean,
    onCloseNav: () => void,
}

const NavBar: React.FC<Props> = ({ isOpenNav, onCloseNav }) => {
    const { pathname } = useRouter();
    const classes = useStyles();
    const [session, sessionIsLoading] = useSession();
    const { locations, isLoading: locationsAreLoading } = useLocations();

    const MenuLinks = [
        {
            title: 'Dashboard',
            icon: <ShowChartIcon />,
            href: '/elw',
            items: []
        },
        {
            title: 'Örtlichkeiten',
            icon: locationsAreLoading ? <CircularProgress /> : <RoomIcon />,
            href: '#',
            items: locationsAreLoading ? [] : Object.keys(locations).map(key => {
                const location = locations[key];

                if (!location.seats || location.seats <= 0) {
                    return;
                }

                return {
                    title: location.name,
                    href: `#location-${location.id}`, // `/elw/location/${location.id}`,
                };
            }).filter(item => !!item),
        }
    ]

    useEffect(() => {
        if (isOpenNav && onCloseNav) {
            onCloseNav();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const renderContent = (
        <>
            <Box className={classes.logoContainer}>
                <Image src={Config.LOGO} alt={`Logo ${Config.VENDOR_NAME}`} height={60} width="auto" unoptimized={true} />
            </Box>

            {session && <Link
                underline="none"
                component={RouterLink}
                href="#"
            >
                <div className={classes.account}>
                    <Avatar />

                    <Box marginLeft={2} style={{ overflow: 'hidden' }}>
                        <Typography variant="subtitle2" className={classes.primary}>
                            {session?.user.email}
                        </Typography>
                        {session?.user.role && <Typography variant="body2" className={classes.secondary}>
                            {RoleTranslation[session?.user.role]}
                        </Typography>}
                    </Box>
                </div>
            </Link>}

            <Box className={classes.content}>
                {renderNavItems({
                    items: MenuLinks,
                    pathname,
                    level: 0,
                })}

                <Box className={classes.doc}>
                    <Typography variant="body2" className={classes.secondary} style={{ textAlign: 'center', fontSize: '0.7rem' }} gutterBottom>
                        &copy; <Link style={{ color: 'inherit' }} href="https://github.com/drkTettnang/corona-testing">Liberato (AGPL-3.0)</Link>
                    </Typography>
                    <Typography variant="body2" className={classes.secondary} style={{ textAlign: 'center', fontSize: '0.7rem' }}>
                        Icons erstellt durch <Link style={{ color: 'inherit' }} href="https://www.freepik.com">Freepik</Link> von <Link style={{ color: 'inherit' }} href="https://www.flaticon.com/">flaticon.com</Link>.
                    </Typography>
                </Box>
            </Box>
        </>
    );

    return (
        <nav className={classes.drawer}>
            <Hidden lgUp>
                <Drawer
                    anchor="left"
                    open={isOpenNav}
                    variant="temporary"
                    onClose={onCloseNav}
                    classes={{ paper: classes.drawerPaper }}
                >
                    {renderContent}
                </Drawer>
            </Hidden>
            <Hidden mdDown>
                <Drawer
                    open
                    anchor="left"
                    variant="persistent"
                    classes={{ paper: classes.drawerPaper }}
                >
                    {renderContent}
                </Drawer>
            </Hidden>
        </nav>
    )
}

export default NavBar;