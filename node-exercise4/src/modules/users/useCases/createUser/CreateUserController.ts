import { Response, Request } from "express";
import { User } from "modules/users/model/User";

import { CreateUserUseCase } from "./CreateUserUseCase";

class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  handle(req: Request, res: Response): Response {
    const { name, email } = req.body;
    let user: User;

    try {
      user = this.createUserUseCase.execute({ name, email });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    return res.status(201).json({ user });
  }
}

export { CreateUserController };
