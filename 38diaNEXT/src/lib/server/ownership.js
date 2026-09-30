import mongoose from 'mongoose';

export function isValidId(id) {
  return mongoose.isValidObjectId(id);
}

export function sameId(a, b) {
  return Boolean(a && b) && a.toString() === b.toString();
}

export async function requireOwner(Model, ownerField, id, user) {
  if (!isValidId(id)) {
    return { error: 'Invalid id', status: 400 };
  }

  const resource = await Model.findById(id);
  if (!resource) {
    return { error: `${Model.modelName} not found`, status: 404 };
  }

  if (!user.is_admin && !sameId(resource[ownerField], user._id)) {
    return {
      error: `You can only modify your own ${Model.modelName.toLowerCase()}`,
      status: 403
    };
  }

  return { resource };
}
