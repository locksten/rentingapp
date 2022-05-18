import { schemaBuilder } from "schema/schemaBuilder"
import "schema/user"
import "schema/me"
import "schema/listing"
import "schema/renting"
import "schema/feedback"
import "schema/message"
import "schema/report"

export const schema = schemaBuilder.toSchema({})
