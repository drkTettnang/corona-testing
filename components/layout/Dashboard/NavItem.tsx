import clsx from 'clsx';
import React, { useState } from 'react';
import { createStyles, fade, makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import {
  Collapse,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import { useRouter } from 'next/router';

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {},
    listItem: {
      ...theme.typography.body2,
      height: 48,
      textTransform: 'capitalize',
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(2.5),
      color: theme.palette.text.secondary
    },
    subIcon: {
      width: 24,
      height: 24,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '&:before': {
        width: 4,
        height: 4,
        content: "''",
        display: 'block',
        borderRadius: '50%',
        backgroundColor: theme.palette.text.disabled,
        transition: theme.transitions.create('transform')
      }
    },
    isActiveListItem: {
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightMedium,
      backgroundColor: fade(
        theme.palette.primary.main,
        theme.palette.action.selectedOpacity
      ) + ' !important',
      '&:before': {
        top: 0,
        right: 0,
        width: 3,
        bottom: 0,
        content: "''",
        position: 'absolute',
        backgroundColor: theme.palette.primary.main
      }
    },
    isActiveListItemSub: {
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightMedium,
      '& $subIcon:before': {
        transform: 'scale(2)',
        backgroundColor: theme.palette.primary.main
      }
    }
  })
);

// ----------------------------------------------------------------------

type Props = {
  level: number,
  title: string,
  href: string,
  info?: JSX.Element,
  icon?: JSX.Element,
  open?: boolean,
  className?: string,
}

const NavItem: React.FC<Props> = ({
  level,
  title,
  href,
  info,
  icon,
  open = false,
  children,
  className,
  ...other
}) => {
  const classes = useStyles();
  const [show, setShow] = useState(open);
  const isSubItem = level > 0;
  const router = useRouter();

  const subPath = router.pathname.replace(/^\/elw/, '');
  const subHref = href.replace(/^\/elw/, '');

  const handleShow = () => {
    setShow((show) => !show);
  };

  if (children) {
    return (
      <>
        <ListItem
          button
          disableGutters
          onClick={handleShow}
          className={clsx(
            classes.listItem,
            {
              [classes.isActiveListItem]: open
            },
            className
          )}
          {...other}
        >
          <ListItemIcon>{icon && icon}</ListItemIcon>
          <ListItemText disableTypography primary={title} />
          {info && info}
          {children && (show ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
        </ListItem>

        <Collapse in={show}>{children}</Collapse>
      </>
    );
  }

  return (
    <ListItem
      button
      onClick={() => router.push(href)}
      classes={{
        selected: isSubItem ? classes.isActiveListItemSub : classes.isActiveListItem
      }}
      className={clsx(classes.listItem, className)}
      selected={(subHref.startsWith(subPath) && !!subPath) || (subHref === '' && subPath === '')}
      {...other}
    >
      <ListItemIcon>
        {isSubItem ? <span className={classes.subIcon} /> : icon}
      </ListItemIcon>
      <ListItemText disableTypography primary={title} />

      {info && info}
    </ListItem>
  );
}

export default NavItem;
