import { SagaIterator } from 'redux-saga';
import { all, call, put, select } from 'redux-saga/effects';
// @ts-ignore : no declaration file
import { UPDATE_UI_STATE, updateUI } from 'redux-ui/transpiled/action-reducer';
import {
  SET_VISIBILITY as BANG_SET_VISIBILITY,
  setVisibility as bangSetVisibility,
  SetVisibilityAction as BangSetVisibilityAction,
} from '../bang/duck';
import { isVisible as bangIsVisible } from '../bang/selectors';
import { CHANGE_SELECTED_APP_MAIN, ChangeSelectedAppMain } from '../nav/duck';
import { MARK_AS_DONE } from '../onboarding/duck';
import { isDone } from '../onboarding/selectors';
import { REHYDRATION_COMPLETE } from '../store/duck';
import { StationState } from '../types';
import { callService, takeEveryWitness } from '../utils/sagas';
import {
  SET_CURSOR_ICON,
  SetCursorIcon,
  TOGGLE_VISIBILITY as UI_TOGGLE_VISIBILITY,
  ToggleVisibility as UiToggleVisibility,
} from './duck';

// The notification center UI was removed. The mutual-exclusion logic between
// the bang and the notification center panel is no longer needed — only the
// bang participates now.

type VisibilityActions =
  | BangSetVisibilityAction
  | ChangeSelectedAppMain;

type VisibilityTypes =
  | BANG_SET_VISIBILITY;

const actionCreatorsByActionTypes = Immutable.Map<VisibilityTypes, [VisibilityActions, () => boolean]>([
  [BANG_SET_VISIBILITY, [bangSetVisibility('center-modal', false), bangIsVisible]],
]);

function* computeElementsVisibility(action: VisibilityActions): SagaIterator {
  let mustShow: VisibilityTypes | boolean = false;
  const doNotHide: VisibilityTypes[] = [];
  switch (action.type) {
    case BANG_SET_VISIBILITY:
      if (action.visible) {
        mustShow = action.type;
      }
      break;
    case CHANGE_SELECTED_APP_MAIN:
      mustShow = true;
      doNotHide.push(BANG_SET_VISIBILITY);
      break;
  }
  if (!mustShow) return;

  const shouldBeHidden = actionCreatorsByActionTypes
    .filter((_, k) => k !== mustShow)
    .filter((_, k) => doNotHide.indexOf(k!) === -1);

  let hideAction: [VisibilityActions, () => boolean];
  // @ts-ignore: no iterator declaration
  for (hideAction of shouldBeHidden.values()) {
    const [visibilityAction, visibilitySelector] = hideAction;
    if (yield select(visibilitySelector)) {
      yield put(visibilityAction);
    }
  }
}

function* setCursorIconInWebContents({ cursor }: SetCursorIcon): SagaIterator {
  yield callService('cursor', 'setCursor', cursor);
}

/**
 * Toggle any boolean key in `ui`
 * @param {ToggleVisibility} action
 * @returns {SagaIterator}
 */
function* sagaToggleVisibility(action: UiToggleVisibility): SagaIterator {
  const { key } = action;
  const isVisible: boolean = yield select((state: StationState) => state.getIn(['ui', ...key] as any, false));
  const [uiKey, name] = key;

  yield put(updateUI(uiKey, name, !isVisible));
}

function* onBoardingState(): SagaIterator {
  const state = yield select(isDone);
  yield call(setStateMenuItemResetCurrentApplication, state);
}

function* handleResetApplicationMenuStateFromOnboarding() {
  yield call(setStateMenuItemResetCurrentApplication);
}

function* handleResetApplicationMenuState(
  { payload: { key, name, value } }: { payload: { key: string, name: string, value: boolean } }) {
  switch (key) {
    case 'settings':
      if (name === 'isVisible') yield call(setStateMenuItemResetCurrentApplication, !value);
      break;
    case 'onboarding':
      if (name === 'showWelcomeBack') yield call(setStateMenuItemResetCurrentApplication, !value);
      break;
    case 'invitationModal':
      if (name === 'visible') yield call(setStateMenuItemResetCurrentApplication, !value);
      break;
    default:
      break;
  }
}

function* setStateMenuItemResetCurrentApplication(enabled: boolean = true) {
  yield callService('menu', 'setEnabled', {
    menuItemId: 'reset-current-application',
    value: enabled,
  });
}

export default function* main(): SagaIterator {
  yield all([
    takeEveryWitness(
      [
        CHANGE_SELECTED_APP_MAIN,
        BANG_SET_VISIBILITY,
      ],
      computeElementsVisibility,
    ),
    takeEveryWitness(SET_CURSOR_ICON, setCursorIconInWebContents),
    takeEveryWitness(UI_TOGGLE_VISIBILITY, sagaToggleVisibility),
    takeEveryWitness(REHYDRATION_COMPLETE, onBoardingState),
    takeEveryWitness(MARK_AS_DONE, handleResetApplicationMenuStateFromOnboarding),
    takeEveryWitness(UPDATE_UI_STATE, handleResetApplicationMenuState),
  ]);
}
