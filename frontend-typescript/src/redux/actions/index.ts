import { User } from "../../interfaces/User";

export const LOGIN = "login" as const;
export const LOGOUT = "logout" as const;

interface LoginAction {
  type: typeof LOGIN;
  payload: {
    user: User;
  };
}

interface LogoutAction {
  type: typeof LOGOUT;
}

export type AuthActions = LoginAction | LogoutAction;
