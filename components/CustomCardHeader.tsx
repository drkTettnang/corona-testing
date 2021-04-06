import { CardHeader } from "@material-ui/core";

export default function CustomCardHeader(props) {
    return <CardHeader
        titleTypographyProps={{variant: 'h6'}}
        subheaderTypographyProps={{variant: 'body2'}}
        {...props} />;
};