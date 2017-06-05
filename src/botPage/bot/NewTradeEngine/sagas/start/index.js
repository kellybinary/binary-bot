import { select, put, fork, call } from 'redux-saga/effects';
import * as actions from '../../constants/actions';
import * as states from '../../constants/states';
import * as selectors from '../selectors';
import handleProposalSubscription from './handleProposalSubscription';
import { tradeOptionToProposal } from '../../../tools';

const isTradeOptionTheSame = (oldOpt, newOpt) =>
    [
        'contractTypes',
        'symbol',
        'duration',
        'duration_unit',
        'amount',
        'currency',
        'prediction',
        'barrierOffset',
        'secondBarrierOffset',
    ].every(field => {
        if (oldOpt[field] === newOpt[field]) {
            return true;
        } else if (field === 'contractTypes') {
            try {
                const [oldType1, oldType2] = oldOpt[field];
                const [type1, type2] = newOpt[field];
                return type1 === oldType1 && type2 === oldType2;
            } catch (e) {
                return false;
            }
        }
        return false;
    });

export default function* start({ tradeOption, $scope }) {
    const stage = yield select(selectors.stage);
    const startEffect = put({ type: actions.START, payload: tradeOption });

    if (stage !== states.INITIALIZED) {
        yield startEffect;
        return;
    }

    const currentTradeOption = yield select(selectors.tradeOption);

    yield startEffect;

    if (isTradeOptionTheSame(currentTradeOption, tradeOption)) {
        return;
    }
    const proposalRequests = yield call(tradeOptionToProposal, tradeOption);
    yield fork(handleProposalSubscription, { proposalRequests, $scope });
}
