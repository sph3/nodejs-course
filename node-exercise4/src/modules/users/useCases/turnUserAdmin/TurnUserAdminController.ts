import { Request, Response } from "express";
import { User } from "modules/users/model/User";

import { TurnUserAdminUseCase } from "./TurnUserAdminUseCase";

class TurnUserAdminController {
  constructor(private turnUserAdminUseCase: TurnUserAdminUseCase) {}

  handle(req: Request, res: Response): Response {
    const { user_id } = req.params;
    let user: User;
    try {
      user = this.turnUserAdminUseCase.execute({ user_id });
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
    return res.status(200).json(user);
  }
}

export { TurnUserAdminController };
