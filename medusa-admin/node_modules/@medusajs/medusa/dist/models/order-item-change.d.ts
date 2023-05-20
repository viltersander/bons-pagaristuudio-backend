import { SoftDeletableEntity } from "../interfaces";
import { LineItem } from "./line-item";
import { OrderEdit } from "./order-edit";
export declare enum OrderEditItemChangeType {
    ITEM_ADD = "item_add",
    ITEM_REMOVE = "item_remove",
    ITEM_UPDATE = "item_update"
}
export declare class OrderItemChange extends SoftDeletableEntity {
    type: OrderEditItemChangeType;
    order_edit_id: string;
    order_edit: OrderEdit;
    original_line_item_id?: string;
    original_line_item?: LineItem;
    line_item_id?: string;
    line_item?: LineItem;
    private beforeInsert;
}
/**
 * @schema OrderItemChange
 * title: "Order Item Change"
 * description: "Represents an order edit item change"
 * type: object
 * required:
 *   - created_at
 *   - deleted_at
 *   - id
 *   - line_item_id
 *   - order_edit_id
 *   - original_line_item_id
 *   - type
 *   - updated_at
 * properties:
 *   id:
 *     description: The order item change's ID
 *     type: string
 *     example: oic_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   type:
 *     description: The order item change's status
 *     type: string
 *     enum:
 *       - item_add
 *       - item_remove
 *       - item_update
 *   order_edit_id:
 *     description: The ID of the order edit
 *     type: string
 *     example: oe_01G2SG30J8C85S4A5CHM2S1NS2
 *   order_edit:
 *     description: Available if the relation `order_edit` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/OrderEdit"
 *   original_line_item_id:
 *      description: The ID of the original line item in the order
 *      nullable: true
 *      type: string
 *      example: item_01G8ZC9GWT6B2GP5FSXRXNFNGN
 *   original_line_item:
 *      description: Available if the relation `original_line_item` is expanded.
 *      nullable: true
 *      $ref: "#/components/schemas/LineItem"
 *   line_item_id:
 *      description: The ID of the cloned line item.
 *      nullable: true
 *      type: string
 *      example: item_01G8ZC9GWT6B2GP5FSXRXNFNGN
 *   line_item:
 *      description: Available if the relation `line_item` is expanded.
 *      nullable: true
 *      $ref: "#/components/schemas/LineItem"
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
 */
