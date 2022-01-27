import * as actionTypes from './actions';

export const initialState = {
    isOpen: [], // for active default menu
    opened: true
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const customizationReducer = (state = initialState, action) => {
    let id;
    switch (action.type) {
        case actionTypes.MENU_OPEN:
            id = action.id;
            return {
                ...state,
                isOpen: [id]
            };
        case actionTypes.SET_MENU:
            return {
                ...state,
                opened: action.opened
            };
        case actionTypes.SET_FONT_FAMILY:
            return {
                ...state,
                fontFamily: `'Roboto', sans-serif`
            };
        case actionTypes.SET_BORDER_RADIUS:
            return {
                ...state,
                borderRadius: 12
            };
        default:
            return state;
    }
};

export default customizationReducer;
