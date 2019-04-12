// showConfirm.js in Confirm component folder

import store from '../../redux/index.js';
import { showConfirmModal } from "../../redux/actions/confirm";

const showConfirm = (message) => {
    // redux action to set confirm modal visible
    store.dispatch(showConfirmModal(message));

    return new Promise((resolve) => {
        // subscribing to store and watching for confirm.result field change
        const unsubscribe = store.subscribe(() => {
            const result = store.getState().confirm.result;

            // if field changed and !== '' we unsubscribe and resolve it
            if (result !== '') {
                unsubscribe();
                // result (store.confirm.result) is returned so we can use the function as... well, just function inline
                resolve(result);
            }
        });

    });

};

export default showConfirm;

// -----------------
// Confirm component

import React, { PureComponent, Fragment } from 'react';
import Modal from '../Modal/Modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getConfirmState, getConfirmMessage } from "../../redux/selectors/confirm";
import { handleConfirm } from "../../redux/actions/confirm";
import Button from "../Button/Button";

import styles from './Confirm.module.css';


class Confirm extends PureComponent {

    render() {

        const { confirmState, confirmMessage, handleConfirm } = this.props;

        return (
            <Fragment>
                <Modal
                    isVisible={confirmState}
                    enableCross={true}
                    onCancel={() => handleConfirm(false)}
                    isAlert={true}
                >
                    <h3 className={styles.confirmHeader}>Warning</h3>
                    <div className={styles.confirmMessage}>{confirmMessage}</div>
                    <div className={styles.buttons}>
                        <Button onClick={() => handleConfirm(true)}>Yes</Button>
                        <Button onClick={() => handleConfirm(false)}>No</Button>
                    </div>
                </Modal>
            </Fragment>
        );
    }
}


const mapStateToProps = (state) => ({
    confirmState: getConfirmState(state),
    confirmMessage: getConfirmMessage(state)
});

const mapDispatchToProps = (dispatch) => bindActionCreators(
    {
        handleConfirm
    },
    dispatch
);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Confirm);


// Redux confirm actions

export const showConfirmModal = (message) => ({
    type: 'SHOW_CONFIRM',
    payload: {
        message
    }
});

export const handleConfirm = (result) => ({
    type: 'HANDLE_CONFIRM',
    payload: {
        result: result
    }
});

// -----------------
// reducers

const initState = {
    confirmIsVisible: false,
    message: '',
    result: ''
};

const confirm = (state = initState, action) => {
    switch (action.type) {
        case 'SHOW_CONFIRM':
            return {
                ...state,
                confirmIsVisible: true,
                message: action.payload.message,
                result: ''
            };

        case 'HANDLE_CONFIRM':
            return {
                ...state,
                confirmIsVisible: false,
                result: action.payload.result
            };

        default:
            return state;
    }
};

export default confirm;

// -----------------
// selectors

export const getConfirm = (state) => state.confirm;

export const getConfirmState = (state) => getConfirm(state).confirmIsVisible;
export const getConfirmMessage = (state) => getConfirm(state).message;
