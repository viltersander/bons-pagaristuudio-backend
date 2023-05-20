import { BaseEntity } from "../interfaces/models/base-entity";
import { Product } from "./product";
import { ProductType } from "./product-type";
import { Region } from "./region";
import { ShippingOption } from "./shipping-option";
export declare class TaxRate extends BaseEntity {
    rate: number | null;
    code: string | null;
    name: string;
    region_id: string;
    region: Region;
    metadata: Record<string, unknown>;
    products: Product[];
    product_types: ProductType[];
    shipping_options: ShippingOption[];
    product_count?: number;
    product_type_count?: number;
    shipping_option_count?: number;
    private beforeInsert;
}
/**
 * @schema TaxRate
 * title: "Tax Rate"
 * description: "A Tax Rate can be used to associate a certain rate to charge on products within a given Region"
 * type: object
 * required:
 *   - code
 *   - created_at
 *   - id
 *   - metadata
 *   - name
 *   - rate
 *   - region_id
 *   - updated_at
 * properties:
 *   id:
 *     description: The tax rate's ID
 *     type: string
 *     example: txr_01G8XDBAWKBHHJRKH0AV02KXBR
 *   rate:
 *     description: The numeric rate to charge
 *     nullable: true
 *     type: number
 *     example: 10
 *   code:
 *     description: A code to identify the tax type by
 *     nullable: true
 *     type: string
 *     example: tax01
 *   name:
 *     description: A human friendly name for the tax
 *     type: string
 *     example: Tax Example
 *   region_id:
 *     description: The id of the Region that the rate belongs to
 *     type: string
 *     example: reg_01G1G5V26T9H8Y0M4JNE3YGA4G
 *   region:
 *     description: A region object. Available if the relation `region` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/Region"
 *   products:
 *     description: The products that belong to this tax rate. Available if the relation `products` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/Product"
 *   product_types:
 *     description: The product types that belong to this tax rate. Available if the relation `product_types` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/ProductType"
 *   shipping_options:
 *     type: array
 *     description: The shipping options that belong to this tax rate. Available if the relation `shipping_options` is expanded.
 *     items:
 *       $ref: "#/components/schemas/ShippingOption"
 *   product_count:
 *     description: The count of products
 *     type: integer
 *     example: 10
 *   product_type_count:
 *     description: The count of product types
 *     type: integer
 *     example: 2
 *   shipping_option_count:
 *     description: The count of shipping options
 *     type: integer
 *     example: 1
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: An optional key-value map with additional details
 *     nullable: true
 *     type: object
 *     example: {car: "white"}
 */
