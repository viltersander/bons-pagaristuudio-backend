import { ClaimItem } from "./claim-item";
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity";
export declare class ClaimImage extends SoftDeletableEntity {
    claim_item_id: string;
    claim_item: ClaimItem;
    url: string;
    metadata: Record<string, unknown>;
    private beforeInsert;
}
/**
 * @schema ClaimImage
 * title: "Claim Image"
 * description: "Represents photo documentation of a claim."
 * type: object
 * required:
 *   - claim_item_id
 *   - created_at
 *   - deleted_at
 *   - id
 *   - metadata
 *   - updated_at
 *   - url
 * properties:
 *   id:
 *     description: The claim image's ID
 *     type: string
 *     example: cimg_01G8ZH853Y6TFXWPG5EYE81X63
 *   claim_item_id:
 *     description: The ID of the claim item associated with the image
 *     type: string
 *   claim_item:
 *     description: A claim item object. Available if the relation `claim_item` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/ClaimItem"
 *   url:
 *     description: The URL of the image
 *     type: string
 *     format: uri
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: The date with timezone at which the resource was deleted.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: An optional key-value map with additional details
 *     nullable: true
 *     type: object
 *     example: {car: "white"}
 */
