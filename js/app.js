    const productos = {
    item1: { 
        nombre: 'Item1', 
        precio: 5000, 
        stock: 10,
        descuento: 0 
    }, 
    item2: { 
        nombre: 'Item2', 
        precio: 8000, 
        stock: 5,
        descuento: 0.05  
    },
    item3: { 
        nombre: 'Item3', 
        precio: 8000, 
        stock: 8,
        descuento: 0  
    },
    item4: { 
        nombre: 'Item4', 
        precio: 13000, 
        stock: 10,
        descuento: 0 
    }, 
    item5: { 
        nombre: 'Item5', 
        precio: 7500, 
        stock: 5,
        descuento: 0.05  
    },
    item6: { 
        nombre: 'Item6', 
        precio: 2500, 
        stock: 8,
        descuento: 0  
    }
};


const IVA = 0.21; 


document.addEventListener('DOMContentLoaded', cargarCarrito);

function agregarAlCarrito(nombre, precio, productoKey) {
   
    const producto = productos[productoKey];

   
    if (producto.stock <= 0) {
        alert('¡Producto agotado!');
        return;
    }

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    carrito.push({ 
        nombre: producto.nombre, 
        precio: producto.precio,
        productoKey: productoKey
    });
    
    producto.stock--;
    document.getElementById(`stock-${productoKey}`).textContent = producto.stock;
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    renderizarCarrito();
}

function renderizarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const subtotalCarrito = document.getElementById('subtotal-carrito');
    const descuentoCarrito = document.getElementById('descuento-carrito');
    const ivaCarrito = document.getElementById('iva-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    listaCarrito.innerHTML = '';
    
    let subtotal = 0;
    let descuentoTotal = 0;
    
    carrito.forEach((producto, index) => {
        const productoInfo = productos[producto.productoKey];
        const li = document.createElement('li');
        
        const descuentoProducto = productoInfo.descuento * producto.precio;
        const precioConDescuento = producto.precio - descuentoProducto;
        
        li.innerHTML = `
            ${producto.nombre} - $${producto.precio} 
            ${productoInfo.descuento > 0 ? 
                `<span class="descuento">(Desc. ${(productoInfo.descuento * 100).toFixed(0)}%: 
                -$${descuentoProducto.toFixed(2)})</span>` 
                : ''}
        `;
        
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.onclick = () => eliminarDelCarrito(index);
        
        li.appendChild(botonEliminar);
        listaCarrito.appendChild(li);
        
        subtotal += producto.precio;
        descuentoTotal += descuentoProducto;
    });
    
    const ivaTotal = (subtotal - descuentoTotal) * IVA;
    const total = subtotal - descuentoTotal + ivaTotal;
    
    subtotalCarrito.textContent = subtotal.toFixed(2);
    descuentoCarrito.textContent = descuentoTotal.toFixed(2);
    ivaCarrito.textContent = ivaTotal.toFixed(2);
    totalCarrito.textContent = total.toFixed(2);
}

function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    const producto = productos[carrito[index].productoKey];
    producto.stock++;
    document.getElementById(`stock-${carrito[index].productoKey}`).textContent = producto.stock;
    
    carrito.splice(index, 1);
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    renderizarCarrito();
}

function vaciarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.forEach(item => {
        const producto = productos[item.productoKey];
        producto.stock++;
        document.getElementById(`stock-${item.productoKey}`).textContent = producto.stock;
    });
    
    localStorage.removeItem('carrito');
    
    renderizarCarrito();
}

function cargarCarrito() {
    renderizarCarrito();
}

function mostrarCheckout() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'flex';
    
    const subtotal = parseFloat(document.getElementById('subtotal-carrito').textContent);
    const descuento = parseFloat(document.getElementById('descuento-carrito').textContent);
    const iva = parseFloat(document.getElementById('iva-carrito').textContent);
    const total = parseFloat(document.getElementById('total-carrito').textContent);
    
    document.getElementById('modal-subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('modal-descuento').textContent = descuento.toFixed(2);
    document.getElementById('modal-iva').textContent = iva.toFixed(2);
    document.getElementById('modal-total').textContent = total.toFixed(2);
}

function realizarCompra() {
    alert('¡Compra realizada con éxito!');
    
    localStorage.removeItem('carrito');
    
    cerrarCheckout();
    
    renderizarCarrito();
}

function cerrarCheckout() {
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'none';
}