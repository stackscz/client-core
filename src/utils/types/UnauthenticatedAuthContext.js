// @flow
import t, { $Refinement } from 'tcomb';
import type { AuthContext } from './AuthContext';

const isUnauthenticated = (authContext) => t.Nil.is(authContext.user);
export type UnauthenticatedAuthContext = AuthContext & $Refinement<typeof isUnauthenticated>;
