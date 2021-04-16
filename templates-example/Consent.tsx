import { Link } from '@material-ui/core';
import React from 'react';
import Config from '../lib/Config';

const consent = [
    <span>Die <Link target="_blank" href={Config.HOMEPAGE_PRIVACY}>Datenschutz-Hinweise</Link> habe ich zur Kenntnis genommen.</span>,
    'Mir ist bewusst, dass durch die Anmeldung kein Anspruch auf Durchführung eines Schnelltests abgeleitet werden kann.',
    'Mir ist bewusst, dass ich nur ohne Anzeichen einer Corona-Erkrankung erscheinen darf.',
];

export default consent;