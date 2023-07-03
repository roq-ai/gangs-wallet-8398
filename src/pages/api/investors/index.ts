import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { investorValidationSchema } from 'validationSchema/investors';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getInvestors();
    case 'POST':
      return createInvestor();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getInvestors() {
    const data = await prisma.investor
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'investor'));
    return res.status(200).json(data);
  }

  async function createInvestor() {
    await investorValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.follow_follow_followed_idToinvestor?.length > 0) {
      const create_follow_follow_followed_idToinvestor = body.follow_follow_followed_idToinvestor;
      body.follow_follow_followed_idToinvestor = {
        create: create_follow_follow_followed_idToinvestor,
      };
    } else {
      delete body.follow_follow_followed_idToinvestor;
    }
    if (body?.follow_follow_follower_idToinvestor?.length > 0) {
      const create_follow_follow_follower_idToinvestor = body.follow_follow_follower_idToinvestor;
      body.follow_follow_follower_idToinvestor = {
        create: create_follow_follow_follower_idToinvestor,
      };
    } else {
      delete body.follow_follow_follower_idToinvestor;
    }
    if (body?.investment?.length > 0) {
      const create_investment = body.investment;
      body.investment = {
        create: create_investment,
      };
    } else {
      delete body.investment;
    }
    const data = await prisma.investor.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
