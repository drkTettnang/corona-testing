import React from 'react';
import {
    MjmlSection,
    MjmlColumn,
    MjmlText,
    MjmlSocial,
    MjmlSocialElement
} from 'mjml-react';
import { facebookIcon, webIcon, instagramIcon } from "../../../lib/const";
import Config from "../../../lib/Config";

export default function Footer() {
    return (
        <MjmlSection padding-top="0px" padding="20px 0" text-align="center">
            <MjmlColumn>
                <MjmlText align="center" color="#a1a1a1">
                    <p>{Config.VENDOR_ADDRESS.map((line, i) => <span key={i}>{line}<br /></span>)}</p>
                </MjmlText>

                <MjmlSocial align="center">
                    <MjmlSocialElement name="facebook" src={facebookIcon} href="https://www.facebook.com/drkTettnang/"></MjmlSocialElement>
                    <MjmlSocialElement name="web" src={webIcon} href="https://drk-tettnang.de"></MjmlSocialElement>
                    <MjmlSocialElement name="instagram" src={instagramIcon} href="https://www.instagram.com/drk_ortsverein_tettnang/"></MjmlSocialElement>
                </MjmlSocial>
            </MjmlColumn>
        </MjmlSection>
    );
}