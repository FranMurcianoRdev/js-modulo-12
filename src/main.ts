interface Reserva {
    tipoHabitacion: "standard" | "suite";
    desayuno: boolean;
    pax: number;
    noches: number;
}


abstract class ReservaHotel {
    reservas: Reserva[];
    preciosHabitacion: { [key in Reserva["tipoHabitacion"]]: number };
    iva: number;

    constructor(reservas: Reserva[], preciosHabitacion: { [key in Reserva["tipoHabitacion"]]: number }, iva: number = 0.21) {
        this.reservas = reservas;
        this.preciosHabitacion = preciosHabitacion;
        this.iva = iva;
    }

    calcularSubtotal(): number {
        let subtotal = 0;

        this.reservas.forEach((reserva) => {
            const precioBase = this.preciosHabitacion[reserva.tipoHabitacion];
            const cargoAdicional = reserva.pax > 1 ? (reserva.pax - 1) * 40 : 0; // 40 € por persona adicional
            const costoDesayuno = reserva.desayuno ? reserva.pax * 15 : 0; // 15 € por persona y noche si hay desayuno
            const costoPorNoche = precioBase + cargoAdicional + costoDesayuno;
            subtotal += costoPorNoche * reserva.noches;
    });

    return subtotal;
    }

    abstract calcularTotal(): number;
}


class ClienteParticular extends ReservaHotel {
    constructor(reservas: Reserva[]) {
    //definir los precios de las habitaciones y se pasan al padre
    const preciosHabitacion = {
        standard: 100,
        suite: 150,
    };
    super(reservas, preciosHabitacion);
    }

    calcularTotal(): number {
        const subtotal = this.calcularSubtotal();
        return subtotal * (1 + this.iva);
    }
}

class OperadorTour extends ReservaHotel {
    private descuento: number;

    constructor(reservas: Reserva[]) {
    const preciosHabitacion = {
        standard: 100,
        suite: 100,
    };
    super(reservas, preciosHabitacion);
    this.descuento = 0.15;
    }

    calcularTotal(): number {
    const subtotal = this.calcularSubtotal();
    const subtotalConDescuento = subtotal * (1 - this.descuento); // Aplicar el 15% de descuento
    return subtotalConDescuento * (1 + this.iva); // Luego se aplica el IVA
    }
}

const reservas: Reserva[] = [
    { tipoHabitacion: "standard", desayuno: false, pax: 1, noches: 3 },
    { tipoHabitacion: "standard", desayuno: false, pax: 1, noches: 4 },
    { tipoHabitacion: "suite", desayuno: true, pax: 2, noches: 1 },
];

const clienteParticular = new ClienteParticular(reservas);
console.log(`Subtotal Particular: ${clienteParticular.calcularSubtotal().toFixed(2)} €`);
console.log(`Total Particular (con IVA): ${clienteParticular.calcularTotal().toFixed(2)} €`);

const operadorTour = new OperadorTour(reservas);
console.log(`Subtotal Operador: ${operadorTour.calcularSubtotal().toFixed(2)} €`);
console.log(`Total Operador (con descuento y IVA): ${operadorTour.calcularTotal().toFixed(2)} €`);
