import * as properties from '../../constants/properties';
import proposalInfo from './';

const payload = {};
const itemName = properties.REQUESTED_PROPOSAL;

describe('proposalInfo action creator', () => {
    it('should return an action to update a itemName in proposalInfo', () => {
        expect(proposalInfo({ itemName, payload })).toEqual({
            type: `UPDATE_${itemName}`,
            payload,
        });
    });
    it('should return an action to remove a itemName in proposalInfo', () => {
        expect(proposalInfo({ itemName, payload, meta: { remove: true } })).toEqual({
            type: `REMOVE_${itemName}`,
            payload,
        });
    });
});