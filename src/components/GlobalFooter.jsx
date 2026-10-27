import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";


export default function GlobalFooter() {

     const isDark = useSelector((state) => state.theme.isDark);

  return (
    <footer className="py-4 mt-5 border-top border-2" data-bs-theme={isDark ? "dark" : "light"}>
       <Container>
        <div className="d-flex justify-content-between align-items-center">
            <h5 className="text-primary fw-bold">ShopStream</h5>
            <div className="d-flex justify-content-center align-items-center gap-3">
                <p className="text-muted">Privacy Policy</p>
                <p className="text-muted">Terms of Service</p>
                <p className="text-muted">Contact us</p>
                <p className="text-muted">Shipping info</p>
            </div>
            <p className="text-muted">© 2024 ShopStream Inc. All rights reserved.</p>
        </div>
       </Container>
    </footer>
  )
}
