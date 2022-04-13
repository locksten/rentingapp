import { schemaBuilder } from "schema/schemaBuilder"
import "schema/user"
import "schema/me"
import "schema/listing"
import "schema/renting"
import "schema/feedback"

export const schema = schemaBuilder.toSchema({})
