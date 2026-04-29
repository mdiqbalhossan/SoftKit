import React, { useEffect, useRef } from 'react';
import { Spinner } from 'react-bootstrap';

import { velzonNotifyError } from './VelzonToast';

const Loader = (props: any) => {
    const last = useRef<string | null>(null);

    useEffect(() => {
        if (props.error) {
            const msg = String(props.error);
            if (msg !== last.current) {
                last.current = msg;
                velzonNotifyError(msg);
            }
        }
    }, [props.error]);

    return (
        <React.Fragment>
            <div className="d-flex justify-content-center mx-2 mt-2">
                <Spinner variant="primary"> Loading... </Spinner>
            </div>
        </React.Fragment>
    );
};

export default Loader;
