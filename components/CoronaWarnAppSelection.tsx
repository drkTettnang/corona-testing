import { FormControl, Typography, RadioGroup, FormControlLabel, Radio, Link } from '@material-ui/core';
import { CWAVariant } from '@prisma/client';
import React from 'react';
import Config from '../lib/Config';

type Props = {
    cwa: CWAVariant,
    onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void,
    disabled?: boolean,
}

const CoronaWarnAppSelection: React.FC<Props> = ({ cwa, onChange, disabled }) => {
    return (
        <FormControl component="fieldset">
            <Typography variant="body1" gutterBottom={true}>Im folgenden können Sie wählen ob und wie das Ergebnis
                an die Corona-Warn-App übermittelt werden soll. In unseren <Link target="_blank" href={Config.HOMEPAGE_PRIVACY}>Datenschutz-Hinweisen</Link>{' '}
                erhalten Sie weitere Informationen zur Datenverarbeitung.</Typography>

            <RadioGroup aria-label="corona warn app" value={cwa} onChange={onChange} style={{ marginBottom: 12 }}>
                <FormControlLabel
                    disabled={disabled}
                    style={{ marginBottom: '12px' }}
                    value={CWAVariant.full}
                    name="cwa"
                    label={<>
                        <strong>Personalisierte</strong> Übermittlung des Testergebnisses an die Corona-Warn-App.
                        <em>Das Einverständnis des Getesteten zum Übermitteln des Testergebnisses und des pseudonymen Codes an das
                            Serversystem des RKI zum Zweck des Ergebnisabrufs in der Corona-Warn-App wurde erteilt. Der Getestete
                            willigte außerdem in die Übermittlung von Name und Geburtsdatum an die App zur Anzeige des Testergebnisses
                            in der App als namentlicher Testnachweis ein. Dem Getesteten wurden Hinweise zum Datenschutz
                            ausgehändigt.</em>
                    </>}
                    control={<Radio required={true} />} />

                <FormControlLabel
                    disabled={disabled}
                    style={{ marginBottom: '12px' }}
                    value={CWAVariant.light}
                    name="cwa"
                    label={<>
                        <strong>Anonyme</strong> Übermittlung des Testergebnisses an die Corona-Warn-App.
                        <em>Das Einverständnis des Getesteten zum Übermitteln des Testergebnisses und des pseudonymen Codes an das
                            Serversystem des RKI zum Zweck des Ergebnisabrufs in der Corona-Warn-App wurde erteilt. Es wurde darauf
                            hingewiesen, dass das Testergebnis in der App hierbei nicht als namentlicher Testnachweis verwendet werden
                            kann. Dem Getesteten wurden Hinweise zum Datenschutz ausgehändigt.</em>
                    </>}
                    control={<Radio required={true} />} />

                <FormControlLabel
                    disabled={disabled}
                    value={CWAVariant.none}
                    name="cwa"
                    label={<><strong>Keine</strong> Übermittlung des Testergebnisses an die Corona-Warn-App.</>}
                    control={<Radio required={true} />} />
            </RadioGroup>
            {cwa === CWAVariant.full && <Typography variant="body1" color="textSecondary">Durch ein personalisiertes Ergebnis kann die App als Nachweis genutzt werden. Die Daten werden erst durch Scannen eines QR-Codes in die App übetragen.</Typography>}
            {cwa === CWAVariant.light && <Typography variant="body1" color="textSecondary">Durch Scannen eines QR-Codes kann nur das Resultat in der App abgerufen werden.</Typography>}
            {cwa === CWAVariant.none && <Typography variant="body1" color="textSecondary">Die Nutzung der Corona-Warn-App ist nicht möglich.</Typography>}
        </FormControl>
    )
}

export default CoronaWarnAppSelection;