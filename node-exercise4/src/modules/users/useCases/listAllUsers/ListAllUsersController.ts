import { Request, Response } from "express";
import { User } from "modules/users/model/User";

import { ListAllUsersUseCase } from "./ListAllUsersUseCase";

class ListAllUsersController {
  constructor(private listAllUsersUseCase: ListAllUsersUseCase) {}

  handle(req: Request, res: Response): Response {
    const { user_id: id } = req.headers;
    const user_id = id.toString();

    let usersList: User[];

    try {
      usersList = this.listAllUsersUseCase.execute({ user_id });
    } catch (e) {
      return res.status(403).json({ error: e.message });
    }

    return res.status(200).json(usersList);
  }
}

export { ListAllUsersController };
