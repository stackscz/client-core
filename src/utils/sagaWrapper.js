/**
 * Eliminates generators "brain$#@!" in testing, see example below.
 *
 * @example
 * // ---> Exemplary saga file.
 * // src/one-app-core/modules/analytics/sagas/fullStoryFlow.js
 * function* fullStoryFlow() {
 *   yield take(INITIALIZE_FINISH);
 *
 * 	 const user = yield select(getUser); // <--- asserting proper action in yield AND providing the result is tricky.
 *
 *   while (true) {
 *     const { type } = yield take([RECEIVE_LOGIN_SUCCESS, RECEIVE_LOGOUT_SUCCESS]);
 *
 *     // ... more actions
 *   }
 * }
 *
 * // ---> Here is the test with a BRAIN$#@!.
 * // tests/one-app-core/modules/analytics/sagas/fullStoryFlow.js
 * test('saga: fullStoryFlow anonymous user', t => {
 *   const saga = fullStoryFlow();
 *
 *   const anonymousUser = { anonymous: true };
 *
 *   t.deepEqual(
 *   	saga.next().value,
 *   	take(INITIALIZE_FINISH),
 *   	'take(INITIALIZE_FINISH)',
 *   );
 *
 *   t.deepEqual(
 *   	saga.next().value,
 *   	select(getUser),
 *   	'select(getUser)',
 *   );
 *
 *   // Down here, there is the BRAIN$#@!.
 *   t.deepEqual(
 *   	saga.next(anonymousUser).value, // <--- you are sending `anonymousUser` a step AFTER the `select(getUser)`.
 *   	take([RECEIVE_LOGIN_SUCCESS, RECEIVE_LOGOUT_SUCCESS]),
 *   	'While 1st iteration: take([RECEIVE_LOGIN_SUCCESS, RECEIVE_LOGOUT_SUCCESS])',
 *   );
 *
 *   t.end();
 * });
 *
 *
 *
 * // --------> There, `sagaWrapper` makes testing "reasonable". I guess...
 * // tests/one-app-core/modules/analytics/sagas/fullStoryFlow.js
 * test('saga: fullStoryFlow anonymous user', t => {
 *   const saga = sagaWrapper(fullStoryFlow()); // ---> make the saga reasonable.
 *
 *   const anonymousUser = { anonymous: true };
 *
 *   t.deepEqual(
 *   	saga.next().value,
 *   	take(INITIALIZE_FINISH),
 *   	'take(INITIALIZE_FINISH)',
 *   );
 *
 *   t.deepEqual(
 *   	saga.next(anonymousUser).value, // <--- here you go - you provide the result along the `select(getUser)` action.
 *   	select(getUser),
 *   	'select(getUser)',
 *   );
 *
 *   // No brainfuck anymore
 *   t.deepEqual(
 *   	saga.next({ type: RECEIVE_LOGIN_SUCCESS }).value,
 *   	take([RECEIVE_LOGIN_SUCCESS, RECEIVE_LOGOUT_SUCCESS]),
 *   	'While 1st iteration: take([RECEIVE_LOGIN_SUCCESS, RECEIVE_LOGOUT_SUCCESS])',
 *   );
 *
 *   t.end();
 * });
 *
 * @param {Object} saga
 * @returns {*}
 */
export default function sagaWrapper(saga) {
	let nextValue = saga.next();

	return {
		next(value) {
			const currentValue = nextValue;

			nextValue = saga.next(value);

			return currentValue;
		},
		throw(exception) {
			const currentValue = nextValue;

			nextValue = saga.throw(exception);

			return currentValue;
		},
		// TODO: implement `return` when truly needed.
	};
}
