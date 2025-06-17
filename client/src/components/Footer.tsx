import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h4 className="text-xl font-bold mb-4">Místico</h4>
            <p className="text-gray-400 mb-4">
              Creamos productos artesanales para elevar tu experiencia espiritual y conectarte con tu ser interior.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold mb-4">Enlaces Rápidos</h5>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors">Inicio</a></li>
              <li><a href="/productos" className="hover:text-white transition-colors">Productos</a></li>
              <li><a href="#categories" className="hover:text-white transition-colors">Categorías</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Sobre Nosotros</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="font-semibold mb-4">Atención al Cliente</h5>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#contact" className="hover:text-white transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Envíos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Devoluciones</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h5 className="font-semibold mb-4">Contacto</h5>
            <div className="space-y-2 text-gray-400">
              <p className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                info@mistico.com
              </p>
              <p className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                +52 55 1234 5678
              </p>
              <p className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Ciudad de México, México
              </p>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">&copy; 2025 Místico. Todos los derechos reservados.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Términos y Condiciones
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Política de Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
