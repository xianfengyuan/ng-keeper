import { Directive, ElementRef, HostListener, HostBinding, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appDropdown]',
    standalone: false
})
export class DropdownDirective {
  private isOpen = false;

  // @HostBinding('class.open') isOpen = false;
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  // Toggle dropdown when the host element (button) is clicked
  @HostListener('click') toggleDropdown() {
    this.isOpen = !this.isOpen;
    const dropdownMenu = this.el.nativeElement.querySelector('.dropdown-menu');

    if (this.isOpen) {
      this.renderer.addClass(dropdownMenu, 'show');
    } else {
      this.renderer.removeClass(dropdownMenu, 'show');
    }
  }

  // Close the dropdown if clicked outside
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;

    if (!this.el.nativeElement.contains(targetElement)) {
      this.isOpen = false;
      const dropdownMenu = this.el.nativeElement.querySelector('.dropdown-menu');
      this.renderer.removeClass(dropdownMenu, 'show');
    }
  }

  // @HostListener('mouseenter') onMouseEnter() {
  //   const dropdownMenu = this.el.nativeElement.querySelector('.dropdown-menu');
  //   this.renderer.addClass(dropdownMenu, 'show');
  // }

  // @HostListener('mouseleave') onMouseLeave() {
  //   const dropdownMenu = this.el.nativeElement.querySelector('.dropdown-menu');
  //   this.renderer.removeClass(dropdownMenu, 'show');
  // }
}
