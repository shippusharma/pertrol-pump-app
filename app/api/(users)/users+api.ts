import { connectToDatabase } from '@/configs';
import { CoreController } from '@/core';
import type { IUserSchema } from '@/model/types/user';
import { UserModel } from '@/model/user.mode';
import { ERoleType } from '@/types/enums';
import { internalErrorResponse, sendResponse } from '@/utils/response-handlers';
import { getPaginationQueryParams } from '@/utils/validate.utils';

export async function GET(req: Request, res: Response) {
  try {
    const { page, limit, offset, sortBy, orderBy, search } = getPaginationQueryParams<IUserSchema>(req);

    await connectToDatabase();
    const coreController = new CoreController<IUserSchema>(UserModel);
    const { pagination, data } = await coreController.pagination({
      page,
      limit,
      offset,
      sortBy,
      orderBy,
      filter: { role: ERoleType.USER },
      search,
      searchKeys: ['name'],
    });

    return sendResponse(200, 'All users details.', { pagination, data });
  } catch (error) {
    return internalErrorResponse(error);
  }
}
