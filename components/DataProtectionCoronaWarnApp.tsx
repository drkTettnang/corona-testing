import { Typography } from '@material-ui/core';
import React from 'react';

type Props = {

}

const DataProtectionCoronaWarnApp: React.FC<Props> = () => {
    return (
        <>
            <Typography variant="h4" gutterBottom={true}>Hinweise zur Nutzung der Corona-Warn-App</Typography>
            <Typography variant="body1" paragraph>Falls Sie die Corona-Warn-App („App“) des Robert Koch-Instituts („RKI“) zum
                Abruf Ihres Testergebnisses eines Antigentests verwenden möchten, gelten folgende Hinweise. Sollten Sie jünger als 16 Jahre alt sein,
                besprechen Sie die Nutzung der App bitte mit Ihren Eltern oder Ihrer sorgeberechtigten Person. Um Ihr Testergebnis über die App
                abrufen zu können ist es notwendig, dass Ihr Testergebnis von der Teststelle an das Serversystem des RKI übermittelt wird.
                Verkürzt dargestellt erfolgt dies, indem die Teststelle Ihr Testergebnis, verknüpft mit einem maschinenlesbaren
                Code, auf einem hierfür bestimmten Server des RKI ablegt. Der Code ist Ihr Pseudonym, weitere Angaben zu Ihrer
                Person sind für die Anzeige des Testergebnisses in der App nicht erforderlich. Sie können die Anzeige des
                Testergebnisses jedoch für sich durch Angabe Ihres Namens, Vornamens und Geburtsdatums personalisieren
                lassen.<br />
                Der Code wird aus dem vorgesehenen Zeitpunkt des Tests und einer Zufallszahl gebildet. Die Bildung des Codes
                erfolgt, indem die vorgenannten Daten so miteinander verrechnet werden, dass ein Zurückrechnen der Daten aus
                dem Code nicht mehr möglich ist.<br />
                Sie erhalten eine Kopie des Codes in der Darstellung eines QR-Codes, der durch die Kamerafunktion Ihres
                Smartphones in die App eingelesen werden kann. Alternativ können Sie den pseudonymen Code auch als
                Internetverweis erhalten („App Link“), der von der App geöffnet und verarbeitet werden kann. Nur hierdurch ist
                eine Verknüpfung des Testergebnisses mit Ihrer App möglich. Mit Ihrer Einwilligung können Sie dann Ihr
                Testergebnis mit Hilfe der App abrufen. Ihr Testergebnis wird automatisch nach 21 Tagen auf dem Server gelöscht.
                Wenn Sie mit der Übermittlung Ihres pseudonymen Testergebnisses mittels des Codes an die App-Infrastruktur
                zum Zweck des Testabrufs einverstanden sind, bestätigen Sie dies bitte gegenüber den Mitarbeitern der
                Teststelle. Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen. Bitte beachten Sie
                jedoch, dass aufgrund dervorhandenen Pseudonymisierung eine Zuordnung zu Ihrer Person nicht erfolgen kann
                und daher eine Löschung Ihrer Daten erst mit Ablauf der 21-tägigen Speicherfrist automatisiert erfolgt.
                Einzelheiten hierzu finden Sie zudem in den »Datenschutzhinweisen« der Corona-Warn-App des RKI.</Typography>
        </>
    )
}

export default DataProtectionCoronaWarnApp;